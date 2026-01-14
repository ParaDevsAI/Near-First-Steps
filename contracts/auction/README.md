# 🏆 Contrato de Leilão NEAR - JavaScript

Um contrato inteligente simples que implementa um sistema de leilão na blockchain NEAR usando JavaScript.

> 🆕 **Nova versão disponível!** Confira [README-TS.md](./README-TS.md) para a versão TypeScript com suporte a NFT.

## 📋 O que é este contrato?

Este é um contrato de leilão básico onde:
- ✅ Usuários podem fazer lances anexando tokens NEAR
- ✅ O maior lance é sempre rastreado
- ✅ Lances anteriores são devolvidos automaticamente
- ✅ Após o término, o leiloeiro pode resgatar os fundos

## 🚀 Começando

### Escolha sua Versão

Este projeto oferece duas versões:

| Versão | Arquivo | Descrição | Ideal para |
|--------|---------|-----------|------------|
| **JavaScript** | `src/auction.js` | Versão básica e didática | Aprender conceitos |
| **TypeScript** | `src/auction.ts` | Versão avançada com NFT | Produção/Projetos reais |

📖 **Veja [README-TS.md](./README-TS.md)** para a documentação completa da versão TypeScript.

### Pré-requisitos

Certifique-se de ter instalado:

```bash
# Node.js (recomendado: v20 ou superior)
node --version

# NEAR CLI
npm install -g near-cli-rs
```

### Instalação

1. Entre na pasta do projeto:
```bash
cd contracts/auction
```

2. Instale as dependências:
```bash
npm install
```

## 🔨 Compilando o Contrato

### Versão JavaScript (Esta)

Para compilar o contrato JavaScript básico:

```bash
npm run build:js
```

### Versão TypeScript (Avançada)

Para compilar a versão TypeScript com NFT:

```bash
npm run build
```

Ou use o script:
```bash
./scripts/build.sh
```

> 💡 **Dica**: Por padrão, `npm run build` compila a versão TypeScript.

## 🧪 Testando o Contrato

Execute os testes automatizados:

```bash
npm test
```

Ou:
```bash
./scripts/test.sh
```

Os testes vão:
1. Compilar o contrato
2. Criar um sandbox NEAR local
3. Fazer deploy do contrato
4. Executar todos os cenários de teste

## 📦 Deploy na Testnet

### 1. Crie uma conta na testnet

```bash
near create-account seu-leilao.testnet --useFaucet
```

### 2. Faça o deploy

```bash
npm run deploy seu-leilao.testnet
```

Ou use o script:
```bash
./scripts/deploy.sh seu-leilao.testnet
```

## 🎮 Usando o Contrato

### Inicializar o Leilão

Primeiro, você precisa inicializar o leilão definindo quando ele termina e quem é o leiloeiro:

```bash
# Calcular timestamp para 5 minutos no futuro (nanossegundos)
FIVE_MINUTES=$(( $(date +%s%N) + 5 * 60 * 1000000000 ))

# Inicializar o leilão
near call seu-leilao.testnet init \
  '{"end_time": "'$FIVE_MINUTES'", "auctioneer": "influencer.testnet"}' \
  --accountId seu-leilao.testnet
```

**Parâmetros:**
- `end_time`: Timestamp em nanossegundos de quando o leilão termina
- `auctioneer`: Conta NEAR que receberá o valor do lance vencedor

### Fazer um Lance

Para fazer um lance, você precisa anexar tokens NEAR à transação:

```bash
# Criar uma conta para fazer o lance
near create-account licitante1.testnet --useFaucet

# Fazer um lance de 1 NEAR
near call seu-leilao.testnet bid '{}' \
  --deposit 1 \
  --accountId licitante1.testnet
```

**Importante:** 
- O lance deve ser maior que o lance atual
- O lance anterior é automaticamente devolvido
- Só é possível fazer lances enquanto o leilão estiver ativo

### Consultar o Maior Lance

Para ver quem está vencendo:

```bash
near view seu-leilao.testnet get_highest_bid
```

**Retorno:**
```json
{
  "bidder": "licitante1.testnet",
  "bid": "1000000000000000000000000"
}
```

O valor do `bid` está em **yoctoNEAR** (1 NEAR = 10²⁴ yoctoNEAR).

### Finalizar o Leilão

Após o leilão terminar, qualquer pessoa pode chamar `claim` para transferir os fundos:

```bash
near call seu-leilao.testnet claim '{}' \
  --accountId qualquer-conta.testnet
```

Isso irá:
- Transferir o lance vencedor para o leiloeiro
- Marcar o leilão como finalizado
- Impedir novas finalizações

## 📚 Estrutura do Código

```
auction/
├── src/
│   └── auction.js          # Código do contrato
├── tests/
│   └── auction.test.js     # Testes automatizados
├── scripts/
│   ├── build.sh           # Script de compilação
│   ├── deploy.sh          # Script de deploy
│   └── test.sh            # Script de testes
├── package.json           # Dependências do projeto
└── README.md             # Esta documentação
```

## 🔍 Métodos do Contrato

### `init({ end_time, auctioneer })`
**Tipo:** `@initialize` (chamado apenas uma vez)
- Inicializa o leilão com tempo de término e leiloeiro

### `bid()`
**Tipo:** `@call` (requer transação + deposit)
- Faz um lance no leilão
- Deve anexar tokens NEAR com `--deposit`
- Devolve o lance anterior automaticamente

### `get_highest_bid()`
**Tipo:** `@view` (leitura, sem custo)
- Retorna o maior lance atual
- Não requer assinatura ou gas

### `claim()`
**Tipo:** `@call` (requer transação)
- Finaliza o leilão após o término
- Transfere fundos para o leiloeiro
- Pode ser chamado por qualquer pessoa

## 💡 Conceitos NEAR

### yoctoNEAR
A menor unidade de NEAR. 1 NEAR = 10²⁴ yoctoNEAR.

### Payable Functions
Funções que podem receber tokens NEAR anexados à chamada.

### View vs Call
- **View**: Leitura apenas, sem custo de gas
- **Call**: Modifica o estado, requer assinatura e gas

### Promises
Contratos NEAR usam promises para transferências e chamadas entre contratos.

## 🐛 Erros Comuns

### "O leilão já terminou"
Você tentou fazer um lance após o término do leilão.

### "Você deve fazer um lance maior que o atual"
Se📈 **Evoluir para TypeScript**: Veja [README-TS.md](./README-TS.md) para a versão com NFT
- 🌐 [Criar um Frontend](../../docs/05-smart-contracts-introducao.md) - Construa uma interface web
- 🎨 [Trabalhar com NFTs](https://docs.near.org/tutorials/auction/winning-an-nft) - Adicione NFTs ao leilão
### "O leilão ainda está em andamento"
Você tentou finalizar o leilão antes do término.

### "O leilão já foi finalizado"
O método `claim` já foi chamado anteriormente.

## 🎯 Próximos Passos

- 🌐 [Criar um Frontend](../../docs/05-smart-contracts-introducao.md) - Construa uma interface web
- 🎨 [Adicionar NFT](https://docs.near.org/tutorials/auction/winning-an-nft) - Dê um NFT ao vencedor
- 🪙 [Lances com FT](https://docs.near.org/tutorials/auction/winning-an-nft) - Aceite Fungible Tokens

## 📖 Recursos

- [Documentação NEAR](https://docs.near.org)
- [NEAR SDK JS](https://github.com/near/near-sdk-js)
- [Exemplos NEAR](https://github.com/near-examples)
- [NEAR Discord](https://discord.gg/nearprotocol)
- [NEAR Telegram](https://t.me/neardev)

## 📝 Licença

MIT

---

Feito com ❤️ para o workshop NEAR
