# 📦 Smart Contracts NEAR - Workshop

Esta pasta contém exemplos práticos de contratos inteligentes desenvolvidos em **JavaScript** para a blockchain NEAR.

## 🎯 Por que JavaScript?

Este workshop foca em JavaScript para:
- ✅ **Acessibilidade**: Muitos desenvolvedores já conhecem JavaScript
- ✅ **Curva de aprendizado**: Menor barreira de entrada que Rust
- ✅ **Prototipagem rápida**: Ideal para aprender conceitos blockchain
- ✅ **Comunidade**: Grande ecossistema e recursos disponíveis

> **Nota**: Para aplicações em produção de alta performance, considere usar Rust. Mas JavaScript é perfeito para aprender!

## 📚 Contratos Disponíveis

### 🏆 [Auction (Leilão)](./auction)
Um contrato de leilão simples e completo.

**O que você aprende:**
- Funções payable (que recebem tokens)
- Gerenciamento de estado
- Transferências entre contas
- Validações e assertions
- Timestamps e lógica temporal

**Funcionalidades:**
- Inicializar leilão com tempo limite
- Fazer lances com tokens NEAR
- Consultar maior lance
- Finalizar e transferir fundos

[📖 Ver documentação completa](./auction/README.md)

## 🚀 Começando

### Pré-requisitos Globais

Instale as ferramentas necessárias:

```bash
# Node.js (use nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts

# NEAR CLI
npm install -g near-cli-rs
```

### Estrutura de um Contrato

Cada contrato segue esta estrutura:

```
nome-contrato/
├── src/
│   └── contract.js       # Código do contrato
├── tests/
│   └── contract.test.js  # Testes automatizados
├── scripts/
│   ├── build.sh         # Compilar
│   ├── deploy.sh        # Fazer deploy
│   └── test.sh          # Executar testes
├── package.json         # Dependências
└── README.md           # Documentação
```

## 🛠️ Workflow Básico

### 1. Instalar Dependências

```bash
cd nome-contrato
npm install
```

### 2. Desenvolver

Edite os arquivos em `src/`:
- Use decorators: `@call`, `@view`, `@initialize`
- Importe do `near-sdk-js`
- Adicione comentários explicativos

### 3. Compilar

```bash
npm run build
```

Gera o arquivo `.wasm` em `build/`.

### 4. Testar

```bash
npm test
```

Executa testes usando NEAR Workspaces (sandbox local).

### 5. Deploy

```bash
# Criar conta na testnet
near create-account meu-contrato.testnet --useFaucet

# Fazer deploy
npm run deploy meu-contrato.testnet
```

### 6. Interagir

```bash
# Chamar função (modifica estado)
near call meu-contrato.testnet funcao '{"param": "valor"}' --accountId sua-conta.testnet

# Ver função (apenas leitura)
near view meu-contrato.testnet funcao_view
```

## 📖 Conceitos Importantes

### Decorators

#### `@initialize({})`
Função chamada apenas uma vez no deploy:
```javascript
@initialize({})
init({ parametro }) {
  this.variavel = parametro;
}
```

#### `@call({})`
Função que modifica o estado (requer transação):
```javascript
@call({})
minhaFuncao() {
  this.contador += 1;
}
```

#### `@call({ payableFunction: true })`
Função que pode receber tokens NEAR:
```javascript
@call({ payableFunction: true })
receberPagamento() {
  const valor = near.attachedDeposit();
  // ...
}
```

#### `@view({})`
Função apenas de leitura (sem custo):
```javascript
@view({})
getContador() {
  return this.contador;
}
```

### Estado do Contrato

O contrato armazena dados na blockchain:

```javascript
@NearBindgen({})
class MeuContrato {
  constructor() {
    // Valores padrão
    this.contador = 0;
    this.dono = '';
  }
}
```

### Funções Úteis NEAR

```javascript
// Quem chamou o contrato
near.predecessorAccountId()

// Conta do próprio contrato  
near.currentAccountId()

// Valor anexado (em yoctoNEAR)
near.attachedDeposit()

// Timestamp atual (nanossegundos)
near.blockTimestamp()

// Registrar logs
near.log('Mensagem')
```

### Transfers e Promises

```javascript
// Transferir tokens para uma conta
return NearPromise.new('destino.testnet')
  .transfer(BigInt('1000000000000000000000000')); // 1 NEAR
```

### Validações

```javascript
import { assert } from 'near-sdk-js';

// Garantir condição
assert(condicao, "Mensagem de erro");
```

## 🧪 Testando Contratos

Os testes usam **near-workspaces** para criar um sandbox:

```javascript
import { Worker } from 'near-workspaces';
import test from 'ava';

test.beforeEach(async (t) => {
  const worker = await Worker.init();
  const root = worker.rootAccount;
  
  // Deploy do contrato
  const contract = await root.createSubAccount('contract');
  await contract.deploy('build/contract.wasm');
  
  // Criar contas de teste
  const alice = await root.createSubAccount('alice', {
    initialBalance: '10 NEAR'
  });
  
  t.context.worker = worker;
  t.context.accounts = { contract, alice };
});

test('meu teste', async (t) => {
  const { contract, alice } = t.context.accounts;
  
  // Chamar função
  await alice.call(contract, 'funcao', { param: 'valor' });
  
  // Verificar resultado
  const resultado = await contract.view('funcao_view');
  t.is(resultado, 'esperado');
});
```

## 💰 Entendendo yoctoNEAR

NEAR usa **yoctoNEAR** como unidade mínima:

```
1 NEAR = 1,000,000,000,000,000,000,000,000 yoctoNEAR (10^24)
```

**Conversões úteis:**
```javascript
// 1 NEAR
'1000000000000000000000000'

// 0.1 NEAR  
'100000000000000000000000'

// 0.01 NEAR
'10000000000000000000000'
```

**No CLI:**
```bash
# O CLI aceita unidades legíveis
--deposit 1        # 1 NEAR
--deposit 0.5      # 0.5 NEAR
--deposit 0.01     # 0.01 NEAR
```

## 🔐 Segurança

### Boas Práticas

✅ **Sempre valide entrada:**
```javascript
assert(valor > 0, "Valor deve ser positivo");
```

✅ **Verifique autorizações:**
```javascript
assert(near.predecessorAccountId() === this.dono, "Não autorizado");
```

✅ **Cuidado com overflows:**
```javascript
// Use BigInt para valores grandes
const total = BigInt(a) + BigInt(b);
```

✅ **Teste exaustivamente:**
- Casos normais
- Casos extremos
- Casos de erro

## 📚 Recursos Adicionais

### Documentação Oficial
- [NEAR Docs](https://docs.near.org)
- [NEAR SDK JS](https://github.com/near/near-sdk-js)
- [NEAR Examples](https://github.com/near-examples)

### Ferramentas
- [NEAR Playground](https://near.org/playground) - IDE online
- [NEAR Explorer](https://testnet.nearblocks.io) - Explorador de blockchain
- [NEAR Wallet](https://testnet.mynearwallet.com) - Carteira testnet

### Comunidade
- [Discord](https://discord.gg/nearprotocol)
- [Telegram](https://t.me/neardev)
- [Forum](https://gov.near.org)

## 🎓 Próximos Passos

1. ✅ Complete o tutorial [Auction](./auction/README.md)
2. 🌐 Crie um frontend para interagir com o contrato
3. 🔄 Explore contratos mais complexos (NFT, FT, DAO)
4. 🚀 Considere aprender Rust para contratos de produção

---

Bons estudos! 🚀

Se tiver dúvidas, consulte a [documentação principal](../README.md) ou entre nos canais da comunidade NEAR.
