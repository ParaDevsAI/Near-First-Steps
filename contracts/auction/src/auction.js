import { NearBindgen, near, call, view, initialize, NearPromise, assert } from 'near-sdk-js';

/**
 * Contrato de Leilão NEAR - Versão Simples
 * 
 * Um contrato inteligente básico que implementa um leilão onde:
 * - Usuários podem fazer lances anexando tokens NEAR
 * - O maior lance é sempre registrado
 * - Lances anteriores são automaticamente devolvidos
 * - Ao final, o leiloeiro pode resgatar os fundos
 */
@NearBindgen({})
class AuctionContract {
  constructor() {
    // Conta que receberá os fundos do leilão
    this.auctioneer = '';
    // Momento em que o leilão termina (timestamp em nanossegundos)
    this.auction_end_time = '';
    // Registro do maior lance: { bidder: 'conta.near', bid: '1000000' }
    this.highest_bid = { bidder: '', bid: '0' };
    // Indica se o leilão já foi finalizado e resgatado
    this.claimed = false;
  }

  /**
   * Inicializa o leilão
   * Deve ser chamado logo após o deploy do contrato
   * 
   * @param end_time - Quando o leilão termina (nanossegundos desde 1970)
   * @param auctioneer - Conta NEAR que receberá o valor do lance vencedor
   */
  @initialize({})
  init({ end_time, auctioneer }) {
    this.auction_end_time = end_time;
    this.auctioneer = auctioneer;
    // Inicializa com o leiloeiro como "lance" inicial de 0
    this.highest_bid = { bidder: auctioneer, bid: '0' };
  }

  /**
   * Fazer um lance no leilão
   * O valor do lance é anexado à transação com --deposit
   * 
   * Exemplo de uso:
   * near call contrato.testnet bid '{}' --deposit 1 --accountId sua-conta.testnet
   * 
   * @returns Promise que devolve o lance anterior para o último licitante
   */
  @call({ payableFunction: true })
  bid() {
    // Garante que o leilão ainda está em andamento
    assert(
      this.auction_end_time > near.blockTimestamp(), 
      "O leilão já terminou"
    );

    // Lance atual: pega o valor anexado à transação
    const bid = near.attachedDeposit();
    const bidder = near.predecessorAccountId();

    // Informações do último lance registrado
    const { bidder: lastBidder, bid: lastBid } = this.highest_bid;

    // Verifica se o novo lance é maior que o atual
    assert(bid > lastBid, "Você deve fazer um lance maior que o atual");

    // Atualiza o maior lance
    this.highest_bid = { bidder, bid };

    // Devolve os tokens para o último licitante
    return NearPromise.new(lastBidder).transfer(lastBid);
  }

  /**
   * Consulta o maior lance atual
   * Método de visualização - não custa gas
   * 
   * Exemplo de uso:
   * near view contrato.testnet get_highest_bid
   * 
   * @returns Objeto com { bidder: 'conta', bid: 'valor em yoctoNEAR' }
   */
  @view({})
  get_highest_bid() {
    return this.highest_bid;
  }

  /**
   * Finaliza o leilão e transfere os fundos para o leiloeiro
   * Pode ser chamado por qualquer pessoa após o término
   * 
   * Exemplo de uso:
   * near call contrato.testnet claim '{}' --accountId qualquer-conta.testnet
   * 
   * @returns Promise que transfere o lance vencedor para o leiloeiro
   */
  @call({})
  claim() {
    // Garante que o leilão já terminou
    assert(
      this.auction_end_time < near.blockTimestamp(), 
      "O leilão ainda está em andamento"
    );

    // Garante que não foi finalizado anteriormente
    assert(!this.claimed, "O leilão já foi finalizado");

    // Marca como finalizado
    this.claimed = true;

    const { bidder, bid } = this.highest_bid;

    near.log(`Leilão finalizado! Vencedor: ${bidder} com lance de ${bid} yoctoNEAR`);

    // Transfere o lance vencedor para o leiloeiro
    return NearPromise.new(this.auctioneer).transfer(bid);
  }
}

export { AuctionContract };
