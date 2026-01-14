import { Worker } from 'near-workspaces';
import test from 'ava';

/**
 * Testes para o contrato de leilão NEAR
 * 
 * Estes testes verificam todas as funcionalidades do contrato:
 * - Inicialização
 * - Fazer lances
 * - Consultar maior lance
 * - Finalizar leilão
 */

test.beforeEach(async (t) => {
  // Cria um worker NEAR sandbox para testes isolados
  const worker = await Worker.init();
  const root = worker.rootAccount;

  // Implanta o contrato
  const contract = await root.createSubAccount('auction-contract');
  await contract.deploy('build/auction.wasm');

  // Cria contas de teste
  const alice = await root.createSubAccount('alice', {
    initialBalance: '10 NEAR'
  });
  
  const bob = await root.createSubAccount('bob', {
    initialBalance: '10 NEAR'
  });

  const charlie = await root.createSubAccount('charlie', {
    initialBalance: '10 NEAR'
  });

  const auctioneer = await root.createSubAccount('auctioneer', {
    initialBalance: '1 NEAR'
  });

  // Salva referências para uso nos testes
  t.context.worker = worker;
  t.context.accounts = { root, contract, alice, bob, charlie, auctioneer };
});

test.afterEach(async (t) => {
  // Limpa o worker após cada teste
  await t.context.worker.tearDown().catch((error) => {
    console.log('Falha ao limpar o worker:', error);
  });
});

/**
 * Teste: Inicialização do contrato
 */
test('deve inicializar o leilão corretamente', async (t) => {
  const { contract, auctioneer } = t.context.accounts;

  // Calcula timestamp para 5 minutos no futuro
  const fiveMinutesFromNow = (Date.now() * 1_000_000 + 5 * 60 * 1_000_000_000).toString();

  // Inicializa o leilão
  await contract.call(contract, 'init', {
    end_time: fiveMinutesFromNow,
    auctioneer: auctioneer.accountId
  });

  // Verifica o leiloeiro
  const contractAuctioneer = await contract.view('get_auctioneer');
  t.is(contractAuctioneer, auctioneer.accountId);

  // Verifica o tempo de término
  const endTime = await contract.view('get_auction_end_time');
  t.is(endTime, fiveMinutesFromNow);

  // Verifica se não foi finalizado
  const claimed = await contract.view('is_claimed');
  t.is(claimed, false);
});

/**
 * Teste: Fazer um lance válido
 */
test('deve aceitar um lance válido', async (t) => {
  const { contract, alice, auctioneer } = t.context.accounts;

  // Inicializa o leilão
  const fiveMinutesFromNow = (Date.now() * 1_000_000 + 5 * 60 * 1_000_000_000).toString();
  await contract.call(contract, 'init', {
    end_time: fiveMinutesFromNow,
    auctioneer: auctioneer.accountId
  });

  // Alice faz um lance de 1 NEAR
  await alice.call(contract, 'bid', {}, {
    attachedDeposit: '1000000000000000000000000' // 1 NEAR em yoctoNEAR
  });

  // Verifica o maior lance
  const highestBid = await contract.view('get_highest_bid');
  t.is(highestBid.bidder, alice.accountId);
  t.is(highestBid.bid, '1000000000000000000000000');
});

/**
 * Teste: Múltiplos lances com devoluções
 */
test('deve devolver o lance anterior quando um novo lance maior é feito', async (t) => {
  const { contract, alice, bob, auctioneer } = t.context.accounts;

  // Inicializa o leilão
  const fiveMinutesFromNow = (Date.now() * 1_000_000 + 5 * 60 * 1_000_000_000).toString();
  await contract.call(contract, 'init', {
    end_time: fiveMinutesFromNow,
    auctioneer: auctioneer.accountId
  });

  // Alice faz um lance de 1 NEAR
  const aliceBalanceBefore = await alice.availableBalance();
  await alice.call(contract, 'bid', {}, {
    attachedDeposit: '1000000000000000000000000' // 1 NEAR
  });

  // Bob faz um lance de 2 NEAR (Alice deve receber de volta)
  await bob.call(contract, 'bid', {}, {
    attachedDeposit: '2000000000000000000000000' // 2 NEAR
  });

  // Verifica que Bob é o maior licitante
  const highestBid = await contract.view('get_highest_bid');
  t.is(highestBid.bidder, bob.accountId);
  t.is(highestBid.bid, '2000000000000000000000000');

  // Alice deve ter recebido seu lance de volta (aproximadamente)
  const aliceBalanceAfter = await alice.availableBalance();
  const difference = BigInt(aliceBalanceAfter.toString()) - BigInt(aliceBalanceBefore.toString());
  
  // Deve ser próximo de 0 (considerando taxas de gás)
  t.true(difference > -100000000000000000000000n); // -0.1 NEAR de margem para gás
});

/**
 * Teste: Rejeitar lance menor ou igual
 */
test('deve rejeitar lance menor ou igual ao atual', async (t) => {
  const { contract, alice, bob, auctioneer } = t.context.accounts;

  // Inicializa o leilão
  const fiveMinutesFromNow = (Date.now() * 1_000_000 + 5 * 60 * 1_000_000_000).toString();
  await contract.call(contract, 'init', {
    end_time: fiveMinutesFromNow,
    auctioneer: auctioneer.accountId
  });

  // Alice faz um lance de 2 NEAR
  await alice.call(contract, 'bid', {}, {
    attachedDeposit: '2000000000000000000000000'
  });

  // Bob tenta fazer um lance de 1 NEAR (deve falhar)
  const error = await t.throwsAsync(
    bob.call(contract, 'bid', {}, {
      attachedDeposit: '1000000000000000000000000'
    })
  );

  t.truthy(error);
  t.true(error.message.includes('Você deve fazer um lance maior que o atual'));
});

/**
 * Teste: Rejeitar lance após fim do leilão
 */
test('deve rejeitar lances após o leilão terminar', async (t) => {
  const { contract, alice, auctioneer } = t.context.accounts;

  // Inicializa o leilão para terminar há 1 segundo (no passado)
  const oneSecondAgo = (Date.now() * 1_000_000 - 1_000_000_000).toString();
  await contract.call(contract, 'init', {
    end_time: oneSecondAgo,
    auctioneer: auctioneer.accountId
  });

  // Alice tenta fazer um lance (deve falhar)
  const error = await t.throwsAsync(
    alice.call(contract, 'bid', {}, {
      attachedDeposit: '1000000000000000000000000'
    })
  );

  t.truthy(error);
  t.true(error.message.includes('O leilão já terminou'));
});

/**
 * Teste: Finalizar leilão e transferir fundos
 */
test('deve finalizar o leilão e transferir fundos para o leiloeiro', async (t) => {
  const { contract, alice, auctioneer } = t.context.accounts;

  // Inicializa o leilão para terminar em 1 segundo
  const oneSecondFromNow = (Date.now() * 1_000_000 + 1_000_000_000).toString();
  await contract.call(contract, 'init', {
    end_time: oneSecondFromNow,
    auctioneer: auctioneer.accountId
  });

  // Alice faz um lance de 3 NEAR
  await alice.call(contract, 'bid', {}, {
    attachedDeposit: '3000000000000000000000000'
  });

  // Aguarda o leilão terminar
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Verifica o saldo do leiloeiro antes
  const auctioneerBalanceBefore = await auctioneer.availableBalance();

  // Finaliza o leilão
  await contract.call(contract, 'claim', {});

  // Verifica que foi marcado como finalizado
  const claimed = await contract.view('is_claimed');
  t.is(claimed, true);

  // Verifica que o leiloeiro recebeu os fundos
  const auctioneerBalanceAfter = await auctioneer.availableBalance();
  const received = BigInt(auctioneerBalanceAfter.toString()) - BigInt(auctioneerBalanceBefore.toString());
  
  // Deve ter recebido aproximadamente 3 NEAR
  t.true(received > 2900000000000000000000000n); // > 2.9 NEAR (considerando taxas)
});

/**
 * Teste: Rejeitar finalização antes do término
 */
test('deve rejeitar finalização antes do leilão terminar', async (t) => {
  const { contract, auctioneer } = t.context.accounts;

  // Inicializa o leilão para terminar em 5 minutos
  const fiveMinutesFromNow = (Date.now() * 1_000_000 + 5 * 60 * 1_000_000_000).toString();
  await contract.call(contract, 'init', {
    end_time: fiveMinutesFromNow,
    auctioneer: auctioneer.accountId
  });

  // Tenta finalizar (deve falhar)
  const error = await t.throwsAsync(
    contract.call(contract, 'claim', {})
  );

  t.truthy(error);
  t.true(error.message.includes('O leilão ainda não terminou'));
});

/**
 * Teste: Rejeitar dupla finalização
 */
test('deve rejeitar finalização dupla', async (t) => {
  const { contract, alice, auctioneer } = t.context.accounts;

  // Inicializa o leilão para terminar em 1 segundo
  const oneSecondFromNow = (Date.now() * 1_000_000 + 1_000_000_000).toString();
  await contract.call(contract, 'init', {
    end_time: oneSecondFromNow,
    auctioneer: auctioneer.accountId
  });

  // Alice faz um lance
  await alice.call(contract, 'bid', {}, {
    attachedDeposit: '1000000000000000000000000'
  });

  // Aguarda o leilão terminar
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Finaliza o leilão pela primeira vez
  await contract.call(contract, 'claim', {});

  // Tenta finalizar novamente (deve falhar)
  const error = await t.throwsAsync(
    contract.call(contract, 'claim', {})
  );

  t.truthy(error);
  t.true(error.message.includes('O leilão já foi finalizado'));
});
