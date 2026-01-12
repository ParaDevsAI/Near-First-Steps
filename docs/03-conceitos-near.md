# 🔑 Módulo 3: Conceitos Fundamentais da NEAR

[← Anterior: O que é NEAR](./02-o-que-e-near.md) | [Voltar ao Índice](../README.md) | [Próximo: Instalação →](./04-instalacao-configuracao.md)

---

![NEAR Accounts](../images/image.png)

## 👤 Contas NEAR

As contas são a base de tudo na NEAR. Através delas você pode:
- 💸 Enviar e receber tokens
- 📝 Interagir com smart contracts
- 🔗 Controlar contas em outras blockchains
- 🎁 Ajudar novos usuários pagando suas taxas

---

## 🆔 Tipos de Endereços (Account IDs)

### 1. Contas Nomeadas (Named Accounts)

**Fáceis de lembrar e compartilhar!**

```
alice.near           ✅ Conta principal
app.near            ✅ Conta de aplicação
sub.alice.near      ✅ Subconta de alice
dev.app.near        ✅ Subconta de app
```

**Regras para nomes:**
- Mínimo de 2 caracteres
- Apenas letras minúsculas, números e hífens
- Deve terminar em `.near` (mainnet) ou `.testnet` (testnet)

### 2. Contas Implícitas (Implicit Accounts)

**Endereços longos derivados de uma chave privada**

```
98793cd91a3f870fb126f66285808c7e094afcfc4eda8a970f6648cdf0dbd6de
```

**Características:**
- 64 caracteres hexadecimais
- Derivadas de uma chave pública
- Sempre existem (não precisam ser criadas)
- Quem tem a chave privada, controla a conta

### 3. Contas Ethereum-like

**Compatíveis com wallets Ethereum**

```
0x85f17cf997934a597031b2e18a9ab6ebd4b9f6a4
```

---

## 🔐 Sistema de Chaves

### Tipos de Chaves de Acesso

```
┌─────────────────────────────────────────────┐
│          alice.near                         │
├─────────────────────────────────────────────┤
│                                             │
│  🔓 Full Access Key                         │
│  └─ Controle total: transferir, deletar,   │
│     implantar contratos, etc.               │
│                                             │
│  🔐 Function Call Key (App Music)           │
│  └─ Só pode: chamar play(), pause()         │
│     Limite: 0.25 NEAR de gas                │
│                                             │
│  🔐 Function Call Key (App Games)           │
│  └─ Só pode: chamar start(), score()        │
│     Limite: 0.1 NEAR de gas                 │
│                                             │
└─────────────────────────────────────────────┘
```

### Full Access Keys (Acesso Completo)

**Pode fazer TUDO:**
- ✅ Transferir tokens
- ✅ Deletar a conta
- ✅ Adicionar/remover chaves
- ✅ Implantar contratos
- ✅ Executar qualquer método

**⚠️ CUIDADO**: Guarde com muito cuidado!

### Function Call Keys (Chaves de Função)

**Acesso limitado:**
- ✅ Pode chamar métodos específicos
- ✅ Tem limite de gas
- ✅ Não pode transferir tokens da conta
- ✅ Perfeito para aplicativos

**Vantagem**: Se comprometida, o dano é limitado!

---

## 📦 Anatomia de uma Conta NEAR

Cada conta NEAR contém:

```
┌───────────────────────────────────────────┐
│  alice.near                               │
├───────────────────────────────────────────┤
│                                           │
│  💰 Balance (Saldo)                       │
│     └─ 10.5 NEAR                          │
│                                           │
│  🔒 Locked Balance (Saldo Bloqueado)      │
│     └─ 50 NEAR (staking)                  │
│                                           │
│  💾 Storage Used (Armazenamento)          │
│     └─ 0.001 NEAR (182 bytes)             │
│                                           │
│  🔑 Access Keys (Chaves)                  │
│     ├─ Full Access Key                    │
│     ├─ Function Key (app1.near)           │
│     └─ Function Key (app2.near)           │
│                                           │
│  📝 Contract Code (Código do Contrato)    │
│     └─ None (conta comum)                 │
│     └─ [WASM] (se tiver contrato)         │
│                                           │
│  💾 Contract State (Estado do Contrato)   │
│     └─ Key-value storage                  │
│                                           │
└───────────────────────────────────────────┘
```

---

## 🏗️ Hierarquia de Contas (Subcontas)

### Como Funciona

```
meuapp.near (conta principal)
    │
    ├── 📱 frontend.meuapp.near
    │   └── Hospeda a interface do usuário
    │
    ├── ⚙️ backend.meuapp.near
    │   └── Smart contracts principais
    │
    ├── 👥 users.meuapp.near
    │   ├── alice.users.meuapp.near
    │   ├── bob.users.meuapp.near
    │   └── carol.users.meuapp.near
    │
    └── 💾 storage.meuapp.near
        └── Armazena dados grandes
```

### Regras de Subcontas

1. **Só o dono pode criar subcontas**
   - `alice.near` pode criar `app.alice.near`
   - `app.alice.near` pode criar `v1.app.alice.near`

2. **Subcontas são independentes**
   - Depois de criadas, são contas separadas
   - Pai NÃO controla automaticamente

3. **Útil para organização**
   - Separação de responsabilidades
   - Versionamento de contratos
   - Gestão de usuários

---

## ⚖️ NEAR vs Ethereum: Principais Diferenças

| Aspecto | Ethereum | NEAR |
|---|---|---|
| **Account ID** | `0x123...` (hash) | `alice.near` (nome) |
| **Chaves** | 1 chave privada | Múltiplas chaves com permissões |
| **Contratos** | Endereço separado | Qualquer conta pode ter contrato |
| **Execução** | Síncrona | Assíncrona |
| **Gas** | Em ordem de dólares | Centavos de dólar |
| **Tempo de bloco** | ~12 segundos | ~1.3 segundos |
| **Custo de storage** | Muito alto | Baixo (1Ⓝ = 100kb) |

---

## 🔄 Modelo Assíncrono da NEAR

### Ethereum: Síncrono

```javascript
// Ethereum - tudo em uma transação
function transfer() {
  token.transfer(alice, 10);    // Executa imediatamente
  nft.mint(alice, tokenId);      // Executa imediatamente
  // Tudo sucesso ou tudo falha junto
}
```

### NEAR: Assíncrono

```javascript
// NEAR - múltiplas transações encadeadas
@call({})
async transfer() {
  // 1ª transação (receipt)
  const promise1 = near.promiseBatchCreate("token.near")
    .functionCall("transfer", {receiver: "alice.near", amount: "10"});
  
  // 2ª transação (receipt)
  const promise2 = near.promiseBatchCreate("nft.near")
    .functionCall("mint", {receiver: "alice.near"});
  
  // Aguarda resultados
  return near.promiseReturn(promise1);
}
```

**Por quê?**
- ✅ Permite sharding eficiente
- ✅ Melhor escalabilidade
- ✅ Menor risco de ataques de reentrância
- ⚠️ Requer pensamento diferente

---

## 💰 Storage Staking (Armazenamento)

### Como Funciona

Na NEAR, você **paga pelo espaço** que usa na blockchain:

```
1 Ⓝ = 100 kilobytes de storage

Exemplos:
- Conta básica: ~0.001 Ⓝ (182 bytes)
- Smart contract simples: ~0.01-0.1 Ⓝ
- NFT storage: ~0.001 Ⓝ por NFT
- Grande aplicação: 1-10 Ⓝ
```

**O valor NÃO é gasto**, está "bloqueado":
- 🔒 Fica reservado enquanto os dados existem
- 💰 Volta para você se deletar os dados
- ♻️ Incentiva limpeza de dados desnecessários

### Exemplo Prático

```
Alice cria conta:
  💰 Balance: 10 Ⓝ
  🔒 Storage: 0.001 Ⓝ (bloqueado)
  ✅ Disponível: 9.999 Ⓝ

Alice implanta contrato (10kb):
  💰 Balance: 10 Ⓝ
  🔒 Storage: 0.101 Ⓝ (bloqueado)
  ✅ Disponível: 9.899 Ⓝ

Alice deleta contrato:
  💰 Balance: 10 Ⓝ
  🔒 Storage: 0.001 Ⓝ (bloqueado)
  ✅ Disponível: 9.999 Ⓝ (volta!)
```

---

## 🎯 Criando Contas

### Opções Disponíveis

#### 1. 🌐 Wallet Web (Mais Fácil)
```
wallet.near.org
├── Escolhe um nome: alice.testnet
├── Método de recuperação: email, frase-semente
└── Pronto! Conta criada
```

#### 2. 💬 Telegram
```
Bot do NEAR no Telegram
└── Carteira dentro do messenger
```

#### 3. 💻 NEAR CLI (Para Desenvolvedores)
```bash
near account create-account fund-myself alice.testnet \
  use-auto-generation save-to-folder ~/.near-credentials
```

#### 4. 🔢 Conta Implícita (Avançado)
```bash
near account create-account fund-later \
  use-auto-generation save-to-folder ~/.near-credentials/implicit
```

---

## 🔐 Segurança de Chaves

### Boas Práticas

#### ✅ Faça:
- Guarde a frase-semente em local seguro físico
- Use hardware wallet para grandes valores
- Tenha backups em locais diferentes
- Use function call keys para aplicativos
- Revise permissões de chaves regularmente

#### ❌ Nunca:
- Compartilhe sua chave privada/frase-semente
- Tire foto da frase-semente
- Armazene em nuvem sem criptografia
- Envie por email/mensagem
- Digite em sites desconhecidos

### Recuperação de Conta

Se você perder acesso:

1. **Com frase-semente**: Pode recuperar tudo ✅
2. **Com email de recuperação**: Depende da carteira
3. **Sem nada**: Conta perdida permanentemente ❌

---

## 🛠️ Operações com Contas

### Transferir NEAR

```bash
# Via CLI
near tokens alice.testnet send-near bob.testnet 5 \
  network-config testnet sign-with-keychain send
```

```javascript
// Via código JavaScript
await account.sendMoney(
  "bob.testnet",  // destinatário
  "5000000000000000000000000"  // 5 NEAR em yoctoNEAR
);
```

### Criar Subconta

```bash
near account create-account fund-myself sub.alice.testnet \
  5 use-manually-provided-public-key ed25519:ABC123... \
  sign-as alice.testnet network-config testnet \
  sign-with-keychain send
```

### Adicionar Chave

```bash
near account add-key alice.testnet grant-full-access \
  use-manually-provided-public-key ed25519:XYZ789... \
  network-config testnet sign-with-keychain send
```

### Deletar Conta

```bash
# ⚠️ IRREVERSÍVEL!
near account delete-account alice.testnet \
  beneficiary bob.testnet network-config testnet \
  sign-with-keychain send
```

---

## 💡 Casos de Uso Práticos

### 1. Aplicativo de Música

```
musicapp.near (contrato principal)
    │
    ├── Usuário: alice.near
    │   └── Function Call Key
    │       ├── play(song_id)       ✅
    │       ├── pause()             ✅
    │       ├── add_to_playlist()   ✅
    │       └── Gas limit: 0.1 NEAR
    │
    └── Se chave comprometida:
        └── Atacante só pode tocar músicas! 🎵
            (Não pode roubar tokens)
```

### 2. Jogo On-Chain

```
game.near (smart contract)
    │
    ├── alice.near (jogadora)
    │   └── Function Call Key
    │       ├── play_turn()
    │       ├── upgrade_character()
    │       └── Gas limit: 0.25 NEAR
    │
    └── Experiência suave:
        └── Joga sem aprovar cada transação!
```

### 3. DAO (Organização Descentralizada)

```
dao.near
    │
    ├── treasury.dao.near (recursos financeiros)
    ├── governance.dao.near (votações)
    ├── alice.members.dao.near (membro)
    └── bob.members.dao.near (membro)
```

---

## 🧪 Testnet vs Mainnet

### Testnet (Rede de Teste)
- 🆓 Tokens grátis via faucet
- 🧪 Para experimentar e aprender
- 🔄 Pode ser resetada
- 📝 Contas terminam em `.testnet`

### Mainnet (Rede Principal)
- 💰 Tokens têm valor real
- 🚀 Para aplicações em produção
- 🔒 Permanente e segura
- 📝 Contas terminam em `.near`

**Sempre comece na testnet! 🎓**

---

## 📊 Visualizando Conta

### NEAR Explorer

Explore contas em:
- **Mainnet**: https://nearblocks.io
- **Testnet**: https://testnet.nearblocks.io

Você pode ver:
- 💰 Saldo da conta
- 📝 Histórico de transações
- 🔑 Chaves de acesso
- 📦 Código do contrato (se houver)
- 💾 Estado do storage

---

## ❓ Perguntas Frequentes

**P: Posso mudar o nome da minha conta?**
R: Não, nomes de conta são permanentes. Mas você pode criar uma nova e migrar.

**P: Quanto custa criar uma conta?**
R: Na testnet é grátis. Na mainnet, aproximadamente 0.1-1 NEAR.

**P: Posso ter várias contas?**
R: Sim! Você pode criar quantas quiser.

**P: O que acontece se eu perder minha chave?**
R: Se você tem função call keys adicionais ou recovery method, pode recuperar. Senão, a conta é perdida.

**P: Posso trocar minha chave se for comprometida?**
R: Sim! Com uma full access key válida, você pode remover a comprometida e adicionar nova.

---

## 🚀 Próximos Passos

Agora que você entende as contas, vamos configurar seu ambiente de desenvolvimento!

👉 [Próximo: Instalação e Configuração](./04-instalacao-configuracao.md)

---

[← Anterior: O que é NEAR](./02-o-que-e-near.md) | [Voltar ao Índice](../README.md) | [Próximo: Instalação →](./04-instalacao-configuracao.md)
