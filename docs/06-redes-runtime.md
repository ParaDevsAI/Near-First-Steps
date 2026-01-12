# 🌐 Módulo 6: Redes e Runtime NEAR

[← Anterior: Smart Contracts](./05-smart-contracts-introducao.md) | [Voltar ao Índice](../README.md) | [Próximo: Multichain →](./07-multichain-abstraction.md)

---

## 🗺️ Redes NEAR

NEAR opera em **três redes** diferentes, cada uma com seu propósito específico.

```
🌍 Mainnet  →  Produção (Dinheiro Real)
🧪 Testnet  →  Testes e Desenvolvimento
💻 Localnet →  Desenvolvimento Local
```

---

## 🚀 Mainnet (Rede Principal)

### Para Que Serve?

A **mainnet** é a rede de produção onde:
- 💰 Tokens NEAR têm valor real
- 🏢 Aplicações em produção rodam
- 🔒 Dados são permanentes e garantidos
- 👥 Usuários reais interagem

### Características

```
📊 Status: https://rpc.mainnet.near.org/status
🔍 Explorer: https://nearblocks.io
👛 Wallet: https://wallet.near.org
⏱️ Tempo de bloco: ~1.3s
💰 Custo de transação: < $0.01
```

### Quando Usar?

- ✅ Aplicação testada e pronta para usuários reais
- ✅ Passou por auditorias de segurança (se manipula valores)
- ✅ Já foi testada extensivamente na testnet
- ✅ Tem plano de manutenção e suporte

### ⚠️ Cuidados

```
❌ NUNCA teste código não verificado na mainnet
❌ NUNCA use chaves privadas da mainnet em código de teste
❌ NUNCA faça deploy sem backup
✅ SEMPRE teste na testnet primeiro
✅ SEMPRE tenha um plano de rollback
```

---

## 🧪 Testnet (Rede de Teste)

### Para Que Serve?

A **testnet** é onde você:
- 🧪 Testa suas aplicações
- 📚 Aprende desenvolvimento NEAR
- 🐛 Encontra e corrige bugs
- 🎓 Experimenta sem risco

### Características

```
📊 Status: https://rpc.testnet.near.org/status
🔍 Explorer: https://testnet.nearblocks.io
👛 Wallet: https://testnet.mynearwallet.com
💰 Tokens: GRÁTIS via faucet
🔄 Pode ser resetada ocasionalmente
```

### Diferenças da Mainnet

| Aspecto | Mainnet | Testnet |
|---|---|---|
| **Tokens** | Valor real ($$$) | Sem valor (grátis) |
| **Permanência** | Permanente | Pode ser resetada |
| **Performance** | Otimizada | Pode ser instável |
| **Contas** | `.near` | `.testnet` |
| **Propósito** | Produção | Desenvolvimento |

### Como Conseguir Tokens Testnet?

```bash
# 1. Via faucet web
# Acesse: https://near-faucet.io

# 2. Via CLI durante criação de conta
near account create-account sponsor-by-faucet-service \
  seunome.testnet autogenerate-new-keypair \
  save-to-keychain network-config testnet create

# 3. Pedir na comunidade
# Discord NEAR Brasil ou Telegram
```

---

## 💻 Localnet (Rede Local)

### Para Que Serve?

A **localnet** é para:
- ⚡ Desenvolvimento ultrarrápido
- 🔒 Trabalho offline e privado
- 🎮 Experimentação total
- 🧪 Testes de integração complexos

### Vantagens

```
✅ Completamente sob seu controle
✅ Muito rápida (sem latência de rede)
✅ Sem custos de token
✅ Privacidade total
✅ Pode modificar parâmetros da rede
```

### Como Usar?

#### Opção 1: NEAR Sandbox (Recomendado)

```javascript
// Usando near-workspaces
import { Worker } from 'near-workspaces';

async function test() {
  // Cria uma localnet temporária
  const worker = await Worker.init();
  const root = worker.rootAccount;

  // Criar conta de teste
  const alice = await root.createSubAccount('alice');
  
  // Deploy contrato
  await alice.deploy('./out/contract.wasm');
  
  // Testar
  await alice.call(alice, 'increment', {});
  const count = await alice.view('get_count', {});
  
  console.log(`Contador: ${count}`);
}

test();
```

#### Opção 2: nearup

```bash
# Instalar nearup
npm install -g nearup

# Iniciar localnet
nearup run localnet

# Parar localnet
nearup stop
```

---

## 🏗️ Arquitetura NEAR

### Visão Geral

NEAR é composta por duas camadas principais:

```
┌─────────────────────────────────────────┐
│       📱 Aplicação / Cliente             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       🔗 Blockchain Layer               │
│  (Consenso, Validação, Propagação)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       ⚙️ Runtime Layer                   │
│  (Execução de Contratos, Estado)        │
└─────────────────────────────────────────┘
```

### Blockchain Layer (Camada de Blockchain)

**Responsabilidades:**
- 🔄 Propagação de transações
- ✅ Validação e consenso
- 📦 Criação de blocos
- 🌐 Comunicação entre nós
- 🔀 Gerenciamento de shards

**Não faz:**
- ❌ Execução de contratos
- ❌ Gerenciamento de estado
- ❌ Lógica de negócios

### Runtime Layer (Camada de Execução)

**Responsabilidades:**
- ⚙️ Execução de contratos (WASM)
- 💾 Gerenciamento de estado
- 📊 Cálculo de gas
- 🔐 Validação de permissões
- 📝 Processamento de receipts

---

## 📨 Transações e Receipts

### O que são?

```
👤 Usuário cria   →  📝 Transação  →  💌 Receipt(s)  →  ✅ Execução

Transação = Pedido do usuário
Receipt = Mensagem interna da rede
```

### Anatomia de uma Transação

```javascript
{
  signerId: "alice.near",           // Quem assinou
  receiverId: "contador.near",      // Destino
  actions: [                        // O que fazer
    {
      type: "FunctionCall",
      method: "increment",
      args: {},
      gas: 30000000000000,
      deposit: "0"
    }
  ],
  nonce: 12345,                     // Número único
  blockHash: "abc123...",           // Hash do bloco
  signature: "xyz789..."            // Assinatura
}
```

### Fluxo de Processamento

![Fluxo de Transações NEAR](../images/fluxo.png)

```
1. 👤 Alice assina transação
   └─> "Chame increment() em contador.near"

2. 📡 Transação propagada na rede
   └─> Validadores recebem

3. ✅ Validador inclui em bloco
   └─> Transação vira Receipt

4. 💌 Receipt processado
   └─> Código do contrato executa

5. 📊 Estado atualizado
   └─> count = 43

6. 🔔 Evento emitido
   └─> Alice recebe confirmação
```

### Receipts Cross-Shard

Quando contratos em shards diferentes se comunicam:

```
Shard 0                    Shard 1
┌─────────────┐           ┌─────────────┐
│ contrato-a  │           │ contrato-b  │
│             │           │             │
│ chama B()   │──Receipt→│ executa()   │
│             │←─Receipt─│ retorna     │
└─────────────┘           └─────────────┘
```

**Importante**: Cross-shard é **assíncrono**!

---

## 🗃️ Sistema Baseado em Contas

### Cada Conta é Independente

```
alice.near
├─ Balance: 10 NEAR
├─ Storage: 0.001 NEAR
├─ Código: None
└─ Estado: None

contador.alice.near
├─ Balance: 1 NEAR
├─ Storage: 0.05 NEAR
├─ Código: [WASM]
└─ Estado: { count: 42 }

nft.alice.near
├─ Balance: 5 NEAR
├─ Storage: 2 NEAR
├─ Código: [WASM]
└─ Estado: { tokens: [...] }
```

### Isolamento de Contas

**Princípio fundamental**: Cada conta vive em seu próprio "mundo"

```javascript
// Contrato não pode acessar diretamente outra conta
// ❌ Não funciona
@view({})
check_balance() {
  return otherAccount.balance;  // Não tem acesso!
}

// ✅ Precisa fazer chamada
@call({})
check_balance_async() {
  return near.promiseBatchCreate("other.near")
    .functionCall("get_balance", {});
}
```

---

## 🔀 Sharding (Nightshade)

### O que é Sharding?

**Sharding** = Dividir a blockchain em partes menores (shards) que processam em paralelo

```
Blockchain Tradicional:
┌──────────────────────────────────┐
│  Todas transações em sequência   │
│  Tx1 → Tx2 → Tx3 → Tx4 → Tx5    │
│  Lento! 😢                        │
└──────────────────────────────────┘

NEAR com Sharding:
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Shard 0  │ │ Shard 1  │ │ Shard 2  │ │ Shard 3  │
│ Tx1, Tx5 │ │ Tx2, Tx6 │ │ Tx3, Tx7 │ │ Tx4, Tx8 │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
       Em paralelo = 4x mais rápido! 🚀
```

### Como Funciona?

1. **Cada conta pertence a um shard**
   ```
   alice.near → Shard 0
   bob.near → Shard 1
   contador.near → Shard 2
   ```

2. **Transações dentro do shard são rápidas**
   ```
   alice.near → alice.near (mesmo shard) ⚡ rápido
   ```

3. **Transações entre shards são assíncronas**
   ```
   alice.near → bob.near (shards diferentes) ⏱️ 1-2 blocos
   ```

### Nightshade (Sharding da NEAR)

**Inovação**: Sharding dinâmico

```
Baixo uso:
┌─────────────────────────────────┐
│        Shard Único              │
│        (eficiente)              │
└─────────────────────────────────┘

Alto uso:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Shard1│ │Shard2│ │Shard3│ │Shard4│
└──────┘ └──────┘ └──────┘ └──────┘
    Escala automaticamente! 📈
```

---

## ⚙️ Execução de Contratos

### Ambiente WASM

Contratos são compilados para **WebAssembly (WASM)**:

```
JavaScript Code         Rust Code
      │                    │
      ├──────── Compile ───┤
      │                    │
      ▼                    ▼
    ┌──────────────────────┐
    │   WASM Binary        │
    │   (Portable)         │
    └──────────────────────┘
             │
             ▼
    ┌──────────────────────┐
    │   NEAR Runtime       │
    │   (Executa WASM)     │
    └──────────────────────┘
```

**Vantagens do WASM:**
- ✅ Rápido e eficiente
- ✅ Seguro (sandboxed)
- ✅ Portável (qualquer linguagem → WASM)
- ✅ Determinístico

### Limites de Execução

```javascript
// Cada função tem limites:
@call({})
expensive_operation() {
  // ⏱️ Gas limit: máximo de 300 TGas
  // 💾 Memory limit: ~4MB
  // 🔢 Stack depth: limitado
  
  // ⚠️ Operações muito caras falham!
  for (let i = 0; i < 1000000; i++) {
    // Vai ficar sem gas!
  }
}
```

---

## 🔄 Consenso (Proof of Stake)

### Como Funciona?

```
1. 💰 Validadores apostam tokens NEAR
   └─ Mínimo: 30,000 NEAR (mainnet)

2. 🎲 Validadores são escolhidos proporcionalmente
   └─ Mais stake = mais chances

3. ✅ Validadores propõem e validam blocos
   └─ Honest behavior = recompensas

4. ⚠️ Comportamento malicioso = perda de stake
   └─ Slashing (penalização)

5. 💰 Recompensas distribuídas
   └─ ~10-12% APY
```

### Epochs (Épocas)

```
Epoch = ~12 horas

┌─────────┐  ┌─────────┐  ┌─────────┐
│ Epoch 1 │→│ Epoch 2 │→│ Epoch 3 │
│ 12h     │  │ 12h     │  │ 12h     │
└─────────┘  └─────────┘  └─────────┘

Em cada epoch:
- Validadores são escolhidos
- Recompensas calculadas
- Stake pode ser atualizado
```

---

## 📊 Parâmetros da Rede

### Mainnet

```yaml
Tempo de bloco: ~1.3s
Finalização: ~2-3 blocos (~2.6-3.9s)
Gas por bloco: 1 PetaGas (1000 TGas)
Custo de storage: 1 NEAR = 100 KB
Taxa base: 0.0001 NEAR
Validadores ativos: ~100
Número de shards: 4 (expansível)
```

### Testnet

```yaml
Similar à mainnet
Tokens: Sem valor
Pode ser resetada: Sim
Validadores: Menos que mainnet
```

---

## 🛠️ Interagindo com as Redes

### Via NEAR CLI

```bash
# Mainnet
near state alice.near network-config mainnet now

# Testnet
near state alice.testnet network-config testnet now

# Especificar RPC customizado
export NEAR_CLI_TESTNET_RPC_SERVER_URL=https://meu-rpc.com
near state alice.testnet network-config testnet now
```

### Via near-api-js

```javascript
import { connect } from 'near-api-js';

// Testnet
const testnetConfig = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://testnet.mynearwallet.com',
  helperUrl: 'https://helper.testnet.near.org'
};

// Mainnet
const mainnetConfig = {
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.near.org',
  helperUrl: 'https://helper.mainnet.near.org'
};

const near = await connect(testnetConfig);
```

---

## 🔍 Explorando a Rede

### NEAR Explorer

**Mainnet**: https://nearblocks.io
**Testnet**: https://testnet.nearblocks.io

**O que você pode ver:**
- 📊 Estatísticas da rede
- 📦 Blocos recentes
- 📝 Transações
- 👤 Detalhes de contas
- 📈 Gráficos de atividade
- 💰 Top contas por balance

### RPC Endpoints

```bash
# Status da rede
curl https://rpc.testnet.near.org/status

# Detalhes de conta
curl -X POST https://rpc.testnet.near.org \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "query",
    "params": {
      "request_type": "view_account",
      "finality": "final",
      "account_id": "alice.testnet"
    }
  }'
```

---

## 📈 Métricas e Monitoramento

### Principais Métricas

```
TPS (Transações por Segundo)
├─ Mainnet: ~1,000 TPS atual
├─ Pico: 13M transações/dia
└─ Teórico: Ilimitado (com sharding)

Finalização
├─ Tempo: ~2.6 segundos
└─ Blocos: 2-3 blocos

Uptime
└─ 5 anos de 100% uptime

Custo
├─ Transação média: < $0.01
└─ Gas price: dinâmico
```

---

## ❓ Perguntas Frequentes

**P: Por que meu contrato funciona na localnet mas não na testnet?**
R: Diferenças em timing, estado da rede, ou dependências externas.

**P: Posso mover uma conta da testnet para mainnet?**
R: Não diretamente. Você precisa criar nova conta na mainnet e redeploy.

**P: O que acontece se a testnet for resetada?**
R: Todos os dados são perdidos. Sempre mantenha backups locais do código.

**P: Sharding afeta meu dApp?**
R: Apenas se você fizer muitas chamadas cross-contract. Considere arquitetura.

**P: Como escolher em qual shard minha conta vai?**
R: É automático, baseado no hash do account ID. Você não escolhe.

---

## 🚀 Próximos Passos

Agora você entende as redes NEAR! Vamos explorar recursos avançados: Chain Abstraction e Multichain.

👉 [Próximo: Multichain e Chain Abstraction](./07-multichain-abstraction.md)

---

[← Anterior: Smart Contracts](./05-smart-contracts-introducao.md) | [Voltar ao Índice](../README.md) | [Próximo: Multichain →](./07-multichain-abstraction.md)
