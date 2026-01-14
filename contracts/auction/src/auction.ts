// Documentação completa em: https://docs.near.org
import { NearBindgen, near, call, view, AccountId, NearPromise, initialize, assert } from "near-sdk-js";

/**
 * Estrutura para representar um lance no leilão
 */
class Bid {
  bidder: AccountId;  // Conta que fez o lance
  bid: bigint;        // Valor do lance em yoctoNEAR
}

// Constantes úteis para interações com contratos
const TWENTY_TGAS = BigInt("20000000000000");  // 20 TGas para chamadas de contrato
const NO_DEPOSIT = BigInt(0);                   // Sem depósito anexado

/**
 * Contrato de Leilão NEAR com NFT - Versão TypeScript
 * 
 * Este contrato implementa um leilão onde:
 * - Usuários fazem lances anexando tokens NEAR
 * - O vencedor recebe um NFT automaticamente
 * - O leiloeiro recebe os fundos do lance vencedor
 * - Lances anteriores são devolvidos automaticamente
 * 
 * @example
 * // Inicializar:
 * near call contrato.testnet init '{"end_time": "1234567890", "auctioneer": "leiloeiro.testnet", "nft_contract": "nft.testnet", "token_id": "1"}' --accountId contrato.testnet
 * 
 * // Fazer lance:
 * near call contrato.testnet bid '{}' --deposit 1 --accountId licitante.testnet
 * 
 * // Finalizar:
 * near call contrato.testnet claim '{}' --accountId qualquer-conta.testnet
 */
@NearBindgen({ requireInit: true })
class AuctionContract {
  // Estado do contrato
  highest_bid: Bid = { bidder: '', bid: BigInt(0) };  // Maior lance atual
  auction_end_time: bigint = BigInt(0);                // Quando o leilão termina (nanossegundos)
  auctioneer: AccountId = "";                          // Quem recebe os fundos
  claimed: boolean = false;                             // Se já foi finalizado
  nft_contract: AccountId = "";                        // Contrato do NFT a ser transferido
  token_id: string = "";                               // ID do NFT

  /**
   * Inicializa o contrato de leilão
   * IMPORTANTE: Deve ser chamado logo após o deploy
   * 
   * @param end_time - Timestamp em nanossegundos de quando o leilão termina
   * @param auctioneer - Conta que receberá os fundos do leilão
   * @param nft_contract - Endereço do contrato NFT
   * @param token_id - ID do token NFT que será transferido ao vencedor
   */
  @initialize({ privateFunction: true })
  init({ end_time, auctioneer, nft_contract, token_id }: { 
    end_time: bigint, 
    auctioneer: AccountId, 
    nft_contract: AccountId, 
    token_id: string 
  }) {
    this.auction_end_time = end_time;
    // Inicializa com o próprio contrato como primeiro "licitante" com lance mínimo
    this.highest_bid = { bidder: near.currentAccountId(), bid: BigInt(1) };
    this.auctioneer = auctioneer;
    this.nft_contract = nft_contract;
    this.token_id = token_id;
  }

  /**
   * Faz um lance no leilão
   * O valor do lance é anexado à transação com --deposit
   * 
   * Validações:
   * - Leilão deve estar ativo (não terminou)
   * - Lance deve ser maior que o atual
   * 
   * Comportamento:
   * - Atualiza o maior lance
   * - Devolve o lance anterior para o último licitante
   * 
   * @returns Promise que transfere o lance anterior de volta
   */
  @call({ payableFunction: true })
  bid(): NearPromise {
    // Garante que o leilão ainda está em andamento
    assert(
      this.auction_end_time > near.blockTimestamp(), 
      "Auction has ended"
    );

    // Lance atual: valor anexado à transação
    const bid = near.attachedDeposit();
    const bidder = near.predecessorAccountId();

    // Último lance registrado
    const { bidder: lastBidder, bid: lastBid } = this.highest_bid;

    // Verifica se o novo lance é maior
    assert(bid > lastBid, "You must place a higher bid");

    // Atualiza o registro do maior lance
    this.highest_bid = { bidder, bid };

    // Devolve os tokens para o último licitante
    return NearPromise.new(lastBidder).transfer(lastBid);
  }

  /**
   * Finaliza o leilão e distribui recompensas
   * Pode ser chamado por qualquer pessoa após o término
   * 
   * Processo:
   * 1. Transfere o NFT para o vencedor
   * 2. Transfere os fundos para o leiloeiro
   * 
   * Validações:
   * - Leilão deve ter terminado
   * - Não pode ter sido finalizado anteriormente
   * 
   * @returns Promise encadeada: NFT -> Fundos
   */
  @call({})
  claim() {
    // Garante que o leilão já terminou
    assert(
      this.auction_end_time <= near.blockTimestamp(), 
      "Auction has not ended yet"
    );
    
    // Garante que não foi finalizado antes
    assert(!this.claimed, "Auction has been claimed");
    
    // Marca como finalizado
    this.claimed = true;

    // Encadeia as operações:
    // 1. Transfere NFT para o vencedor
    // 2. Depois transfere fundos para o leiloeiro
    return NearPromise.new(this.nft_contract)
      .functionCall(
        "nft_transfer",                                      // Método padrão NEP-171
        JSON.stringify({ 
          receiver_id: this.highest_bid.bidder,              // Vencedor recebe o NFT
          token_id: this.token_id 
        }), 
        BigInt(1),                                           // 1 yoctoNEAR anexado
        TWENTY_TGAS                                          // Gas para a chamada
      )
      .then(
        // Após sucesso da transferência do NFT, transfere os fundos
        NearPromise.new(this.auctioneer).transfer(this.highest_bid.bid)
      );
  }

  /**
   * Retorna informações do maior lance atual
   * Método de visualização - não custa gas
   * 
   * @returns Objeto com bidder (conta) e bid (valor)
   */
  @view({})
  get_highest_bid(): Bid {
    return this.highest_bid;
  }

  /**
   * Retorna quando o leilão termina
   * 
   * @returns Timestamp em nanossegundos
   */
  @view({})
  get_auction_end_time(): bigint {
    return this.auction_end_time;
  }
  
  /**
   * Retorna todas as informações do leilão
   * Útil para consultar o estado completo
   * 
   * @returns Objeto com todos os dados do contrato
   */
  @view({})
  get_auction_info(): AuctionContract {
    return this;
  }
}

export { AuctionContract };
