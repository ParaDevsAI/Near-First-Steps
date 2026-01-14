# 🏆 Contrato de Leilão NEAR com NFT - TypeScript

Um contrato inteligente avançado que implementa um sistema de leilão com prêmio NFT na blockchain NEAR usando **TypeScript**.

## 🆕 Novidades desta Versão

Esta versão TypeScript inclui recursos avançados:
- ✅ **NFT como prêmio**: O vencedor recebe automaticamente um NFT
- ✅ **TypeScript**: Tipagem forte e segurança em tempo de compilação
- ✅ **Padrão NEP-171**: Compatível com o padrão de NFT da NEAR
- ✅ **Promises encadeadas**: Transferências automáticas de NFT + fundos
- ✅ **Validação rigorosa**: `requireInit` garante inicialização

## 📋 Diferenças entre JS e TS

| Característica | JavaScript (v1) | TypeScript (v2) |
|---------------|-----------------|-----------------|
| Linguagem | JavaScript | TypeScript |
| Tipagem | Dinâmica | Estática |
| Prêmio | Apenas NEAR | NFT + NEAR |
| Complexidade | Básica | Intermediária |
| Use quando | Aprender conceitos | Produção real |

## 🚀 Começando

### Pré-requisitos

```bash
# Node.js v20 ou superior
node --version

# NEAR CLI
npm install -g near-cli-rs
```

### Instalação

```bash
cd contracts/auction
npm install
```

## 🔨 Compilação

### Compilar TypeScript (Recomendado)

```bash
npm run build
```

### Compilar JavaScript (Versão Básica)

```bash
npm run build:js
```

## 🧪 Testando

```bash
npm test
```

Os testes incluem cenários específicos para a versão com NFT.

## 📦 Deploy

### 1. Criar conta

```bash
near create-account leilao-nft.testnet --useFaucet
```

### 2. Deploy do contrato

```bash
npm run deploy leilao-nft.testnet
```

## 🎮 Usando o Contrato

### Preparação: Deploy de um NFT

**Importante**: Para usar este contrato, você precisa de um contrato NFT já implantado e um token mintado.

```bash
# Exemplo usando um contrato NFT simples
# (Na prática, use um contrato NFT real como paras.near)

# 1. O NFT deve estar mintado
# 2. O contrato de leilão deve ser aprovado para transferir o NFT
near call nft-contrato.testnet nft_approve \
  '{"token_id": "1", "account_id": "leilao-nft.testnet"}' \
  --accountId dono-nft.testnet \
  --deposit 0.01
```

### Inicializar o Leilão

```bash
# Calcular timestamp para 5 minutos no futuro
FIVE_MINUTES=$(( $(date +%s%N) + 5 * 60 * 1000000000 ))

# Inicializar com informações do NFT
near call leilao-nft.testnet init \
  '{
    "end_time": "'$FIVE_MINUTES'",
    "auctioneer": "influencer.testnet",
    "nft_contract": "nft-contrato.testnet",
    "token_id": "1"
  }' \
  --accountId leilao-nft.testnet
```

**Parâmetros:**
- `end_time`: Quando o leilão termina (nanossegundos)
- `auctioneer`: Quem recebe os fundos
- `nft_contract`: Endereço do contrato NFT
- `token_id`: ID do token NFT a ser leiloado

### Fazer Lances

```bash
# Criar conta
near create-account licitante1.testnet --useFaucet

# Fazer lance de 2 NEAR
near call leilao-nft.testnet bid '{}' \
  --deposit 2 \
  --accountId licitante1.testnet
```

### Consultar Status

```bash
# Ver maior lance
near view leilao-nft.testnet get_highest_bid

# Ver todas as informações
near view leilao-nft.testnet get_auction_info
```

**Retorno de `get_auction_info`:**
```json
{
  "highest_bid": {
    "bidder": "licitante1.testnet",
    "bid": "2000000000000000000000000"
  },
  "auction_end_time": "1234567890000000000",
  "auctioneer": "influencer.testnet",
  "claimed": false,
  "nft_contract": "nft-contrato.testnet",
  "token_id": "1"
}
```

### Finalizar Leilão

Após o término, qualquer pessoa pode finalizar:

```bash
near call leilao-nft.testnet claim '{}' \
  --accountId qualquer-conta.testnet \
  --gas 300000000000000
```

**O que acontece:**
1. ✅ NFT é transferido para o vencedor
2. ✅ Fundos (NEAR) são transferidos para o leiloeiro
3. ✅ Leilão é marcado como finalizado

## 🔍 Métodos do Contrato

### `init({ end_time, auctioneer, nft_contract, token_id })`
**Tipo:** `@initialize` + `privateFunction`
- Inicializa o leilão com NFT
- Só pode ser chamado uma vez
- Só pode ser chamado pelo próprio contrato

### `bid()`
**Tipo:** `@call` + `payableFunction`
- Faz um lance anexando NEAR
- Valida que o lance é maior que o atual
- Devolve automaticamente o lance anterior

### `claim()`
**Tipo:** `@call`
- Finaliza após o término
- Transfere NFT para vencedor
- Transfere fundos para leiloeiro
- Usa promises encadeadas

### `get_highest_bid()`
**Tipo:** `@view`
- Retorna `{ bidder, bid }`

### `get_auction_end_time()`
**Tipo:** `@view`
- Retorna timestamp de término

### `get_auction_info()`
**Tipo:** `@view`
- Retorna todas as informações do leilão

## 🎨 Integração com NFT

### Padrão NEP-171

Este contrato usa o método padrão `nft_transfer` do NEP-171:

```typescript
NearPromise.new(this.nft_contract)
  .functionCall(
    "nft_transfer",
    JSON.stringify({ 
      receiver_id: winner, 
      token_id: this.token_id 
    }),
    BigInt(1),        // 1 yoctoNEAR anexado
    TWENTY_TGAS       // Gas para a chamada
  )
```

### Contratos NFT Compatíveis

Exemplos de contratos NFT NEAR:
- **Paras**: `x.paras.near`
- **Mintbase**: `*.mintbase1.near`
- **NFT Simple**: Contratos custom NEP-171

### Aprovação Prévia

⚠️ **Importante**: O contrato de leilão deve ser aprovado para transferir o NFT:

```bash
near call <nft-contract> nft_approve \
  '{"token_id": "<id>", "account_id": "<leilao-contract>"}' \
  --accountId <dono> \
  --deposit 0.01
```

## 💡 Conceitos Avançados

### Promises Encadeadas

```typescript
// Primeiro transfere o NFT
return NearPromise.new(nftContract)
  .functionCall("nft_transfer", ...)
  .then(
    // Só executa se NFT foi transferido com sucesso
    NearPromise.new(auctioneer).transfer(bid)
  )
```

### BigInt em TypeScript

TypeScript requer BigInt explícito:

```typescript
const TWENTY_TGAS = BigInt("20000000000000");
const amount = BigInt(1);
```

### Tipos Fortes

```typescript
class Bid {
  bidder: AccountId;  // String tipada
  bid: bigint;        // Número grande
}
```

### requireInit

```typescript
@NearBindgen({ requireInit: true })
```
Garante que `init()` seja chamado antes de qualquer outra função.

## 🔒 Segurança

### Validações Implementadas

✅ **Leilão ativo**: Não aceita lances após término
```typescript
assert(this.auction_end_time > near.blockTimestamp(), "Auction has ended");
```

✅ **Lance válido**: Deve ser maior que o atual
```typescript
assert(bid > lastBid, "You must place a higher bid");
```

✅ **Não finalizado**: Previne dupla finalização
```typescript
assert(!this.claimed, "Auction has been claimed");
```

✅ **Tempo correto**: Só finaliza após término
```typescript
assert(this.auction_end_time <= near.blockTimestamp(), "Auction has not ended yet");
```

### Boas Práticas

1. **Sempre aprove o NFT** antes de iniciar o leilão
2. **Teste em testnet** antes de usar na mainnet
3. **Verifique o gas** ao finalizar (use 300 TGas)
4. **Confirme ownership** do NFT antes de iniciar

## 🐛 Troubleshooting

### "Auction has ended"
Você tentou fazer um lance após o término. Verifique o `get_auction_end_time()`.

### "You must place a higher bid"
Seu lance não é maior que o atual. Consulte `get_highest_bid()` primeiro.

### "Auction has not ended yet"
Tentou finalizar antes do término. Aguarde o tempo expirar.

### "Auction has been claimed"
O leilão já foi finalizado. Use `get_auction_info()` para verificar.

### Erro na transferência do NFT
- Verifique se o NFT foi aprovado para o contrato de leilão
- Confirme que o `nft_contract` e `token_id` estão corretos
- Certifique-se de que há gas suficiente (300 TGas)

## 📊 Comparação: JS vs TS

### Quando usar JavaScript (auction.js)

✅ Aprendendo smart contracts  
✅ Prototipagem rápida  
✅ Projeto educacional  
✅ Não precisa de NFT  

### Quando usar TypeScript (auction.ts)

✅ Projeto em produção  
✅ Precisa de NFT como prêmio  
✅ Equipe familiarizada com TS  
✅ Requer tipagem forte  

## 🎓 Próximos Passos

1. 📚 [Aprenda mais sobre NFTs](https://nomicon.io/Standards/Tokens/NonFungibleToken)
2. 🎨 [Explore NEP-171](https://nomicon.io/Standards/Tokens/NonFungibleToken/Core)
3. 🌐 [Crie um frontend](https://docs.near.org/tutorials/auction/creating-a-frontend)
4. 🪙 [Adicione Fungible Tokens](https://docs.near.org/tutorials/auction/winning-an-nft)

## 📖 Recursos

- [NEAR TypeScript SDK](https://github.com/near/near-sdk-js)
- [NEP-171: NFT Standard](https://nomicon.io/Standards/Tokens/NonFungibleToken)
- [NFT Examples](https://github.com/near-examples/nft-tutorial-js)
- [NEAR Discord](https://discord.gg/nearprotocol)

## 📝 Licença

MIT

---

Feito com ❤️ para o workshop NEAR • TypeScript Edition
