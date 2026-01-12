# 🛠️ Módulo 4: Instalação e Configuração

[← Anterior: Conceitos NEAR](./03-conceitos-near.md) | [Voltar ao Índice](../README.md) | [Próximo: Smart Contracts →](./05-smart-contracts-introducao.md)

---

## 🎯 Objetivo

Configurar completamente seu ambiente de desenvolvimento para criar aplicações na NEAR Protocol.

---

## 📋 Checklist do que vamos instalar

- ✅ Node.js e npm
- ✅ NEAR CLI
- ✅ Ambiente virtual (opcional mas recomendado)
- ✅ Editor de código (VS Code)
- ✅ Conta NEAR testnet

---

## 🖥️ Requisitos do Sistema

### Sistemas Operacionais Suportados
- 🐧 **Linux** (Ubuntu, Debian, Fedora, etc.)
- 🍎 **macOS** (10.14+)
- 🪟 **Windows** (10/11 com WSL2 recomendado)

### Especificações Mínimas
- **RAM**: 4GB (8GB recomendado)
- **Espaço em disco**: 5GB livres
- **Conexão com internet**: Estável

---

## 📦 Passo 1: Instalando Node.js e npm

Node.js é necessário para executar a NEAR CLI e desenvolver aplicações.

### Linux (Ubuntu/Debian)

```bash
# Atualizar repositórios
sudo apt update

# Instalar Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version  # deve mostrar v20.x.x
npm --version   # deve mostrar 10.x.x
```

### macOS

```bash
# Usando Homebrew (instale em https://brew.sh se não tiver)
brew install node@20

# Verificar instalação
node --version
npm --version
```

### Windows (usando WSL2 - Recomendado)

```powershell
# 1. Instalar WSL2 (PowerShell como Admin)
wsl --install

# 2. Reiniciar o computador

# 3. Abrir Ubuntu no WSL e seguir passos do Linux acima
```

**Alternativa Windows**: Baixar instalador em [nodejs.org](https://nodejs.org)

---

## 🔧 Passo 2: Instalando NEAR CLI

A **NEAR CLI** é a ferramenta de linha de comando para interagir com a blockchain.

### Instalação Global

```bash
# Instalar NEAR CLI Rust (versão mais recente e rápida)
npm install -g near-cli-rs

# Ou a versão JavaScript (mais antiga)
# npm install -g near-cli

# Verificar instalação
near --version
```

### Testando a Instalação

```bash
# Verificar se está funcionando
near --help

# Deve mostrar lista de comandos disponíveis
```

---

## 🐍 Passo 3: Ambiente Virtual (Opcional mas Recomendado)

Embora NEAR use principalmente JavaScript/TypeScript, se você for usar Python para scripts auxiliares, é bom ter um ambiente virtual.

### Para Desenvolvimento JavaScript/TypeScript

#### Usando `nvm` (Node Version Manager)

**Vantagens:**
- Múltiplas versões do Node.js
- Isolamento de projetos
- Troca fácil entre versões

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar shell
source ~/.bashrc  # ou ~/.zshrc no macOS

# Instalar Node.js
nvm install 20
nvm use 20
nvm alias default 20

# Verificar
nvm current  # deve mostrar v20.x.x
```

#### Usando Diretórios de Projeto

```bash
# Criar diretório para projetos NEAR
mkdir ~/near-projects
cd ~/near-projects

# Cada projeto terá seu próprio package.json e node_modules
mkdir meu-primeiro-contrato
cd meu-primeiro-contrato

# Inicializar projeto Node.js
npm init -y
```

### Para Scripts Python (Opcional)

```bash
# Instalar Python 3 (se não tiver)
sudo apt install python3 python3-pip python3-venv  # Linux
brew install python@3.11  # macOS

# Criar ambiente virtual
python3 -m venv ~/near-venv

# Ativar ambiente virtual
source ~/near-venv/bin/activate  # Linux/macOS
# ou
~/near-venv\Scripts\activate  # Windows

# Instalar pacotes úteis
pip install requests python-dotenv
```

---

## 📝 Passo 4: Editor de Código (VS Code)

### Instalar VS Code

**Linux:**
```bash
sudo snap install code --classic
```

**macOS:**
```bash
brew install --cask visual-studio-code
```

**Windows:**
Baixe em [code.visualstudio.com](https://code.visualstudio.com)

### Extensões Recomendadas

Abra VS Code e instale essas extensões:

```
1. Rust Analyzer (para contratos em Rust)
2. JavaScript/TypeScript (já vem embutido)
3. ESLint (linting de código)
4. Prettier (formatação)
5. NEAR (se disponível)
```

**Via linha de comando:**
```bash
code --install-extension rust-lang.rust-analyzer
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

---

## 👛 Passo 5: Criar Conta NEAR Testnet

### Opção 1: Via Wallet Web (Recomendado para Iniciantes)

1. Acesse [https://testnet.mynearwallet.com](https://testnet.mynearwallet.com)
2. Clique em **"Create Account"**
3. Escolha um nome: `seunome.testnet`
4. Escolha método de recuperação (email ou frase-semente)
5. **Guarde a frase-semente em local seguro!**
6. Pronto! Sua conta está criada

### Opção 2: Via NEAR CLI (Para Desenvolvedores)

```bash
# Criar conta e conectar à wallet via navegador
near account create-account sponsor-by-faucet-service seunome.testnet \
  autogenerate-new-keypair save-to-keychain network-config testnet \
  create

# Será aberto o navegador para autenticação
```

### Opção 3: Conta Implícita (Avançado)

```bash
# Criar par de chaves localmente
near account create-account fund-later use-auto-generation \
  save-to-folder ~/.near-credentials/implicit

# Output mostrará:
# - Chave pública
# - ID da conta (64 caracteres)

# Depois financiar via faucet
```

---

## 💰 Passo 6: Conseguir Tokens Testnet

Você precisa de tokens NEAR testnet para pagar gas fees.

### Faucets Disponíveis

1. **NEAR Faucet Oficial**
   ```
   https://near-faucet.io
   ```

2. **Via NEAR CLI**
   ```bash
   near tokens seunome.testnet send-near seunome.testnet 0 \
     network-config testnet sign-with-keychain send
   ```

3. **Pedir na Comunidade**
   - Discord NEAR Brasil
   - Telegram NEAR

---

## ✅ Passo 7: Verificando a Instalação

Vamos testar se tudo está funcionando!

### 1. Verificar Node.js e npm

```bash
node --version
# Esperado: v20.x.x ou superior

npm --version
# Esperado: 10.x.x ou superior
```

### 2. Verificar NEAR CLI

```bash
near --version
# Esperado: near-cli-rs 0.x.x

# Testar comando
near state seunome.testnet network-config testnet now
```

### 3. Verificar Conta

```bash
# Ver informações da sua conta
near account view-account-summary seunome.testnet \
  network-config testnet now

# Deve mostrar:
# - Balance (saldo)
# - Storage used
# - Chaves de acesso
```

### 4. Testar Transação

```bash
# Enviar 0.1 NEAR para você mesmo (teste)
near tokens seunome.testnet send-near seunome.testnet 0.1 \
  network-config testnet sign-with-keychain send

# Se funcionar, está tudo OK! ✅
```

---

## 🗂️ Estrutura de Diretórios Recomendada

Organize seus projetos assim:

```
📁 ~/near-projects/
│
├── 📁 hello-near/              (Primeiro projeto)
│   ├── 📁 contract/            (Smart contract)
│   ├── 📁 frontend/            (Interface web)
│   ├── package.json
│   └── README.md
│
├── 📁 nft-marketplace/         (Projeto NFT)
│   ├── 📁 contracts/
│   ├── 📁 frontend/
│   └── ...
│
└── 📁 utils/                   (Scripts úteis)
    ├── deploy.sh
    └── test.sh
```

---

## 🔐 Gerenciando Credenciais

### Localização das Chaves

As chaves são armazenadas em:
```bash
~/.near-credentials/
├── testnet/
│   └── seunome.testnet.json
└── mainnet/
    └── suaconta.near.json
```

### Ver Conteúdo da Chave

```bash
cat ~/.near-credentials/testnet/seunome.testnet.json
```

```json
{
  "account_id": "seunome.testnet",
  "public_key": "ed25519:ABC123...",
  "private_key": "ed25519:XYZ789..."
}
```

### ⚠️ Segurança

```bash
# Fazer backup seguro
cp -r ~/.near-credentials ~/near-credentials-backup

# Proteger o diretório
chmod 700 ~/.near-credentials
chmod 600 ~/.near-credentials/testnet/*.json
```

---

## 🚀 Criar Primeiro Projeto

Vamos criar um projeto básico para testar tudo!

```bash
# Criar diretório
mkdir -p ~/near-projects/hello-near
cd ~/near-projects/hello-near

# Inicializar projeto Node.js
npm init -y

# Instalar dependências NEAR
npm install near-api-js

# Criar arquivo de teste
cat > test-connection.js << 'EOF'
const { connect, keyStores } = require('near-api-js');
const os = require('os');

async function main() {
  const homedir = os.homedir();
  const keyStore = new keyStores.UnencryptedFileSystemKeyStore(
    `${homedir}/.near-credentials`
  );

  const config = {
    networkId: 'testnet',
    keyStore,
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://testnet.mynearwallet.com',
  };

  const near = await connect(config);
  const account = await near.account('seunome.testnet');  // MUDE AQUI
  
  console.log('✅ Conectado com sucesso!');
  console.log('Balance:', await account.getAccountBalance());
}

main();
EOF

# Executar teste
node test-connection.js
```

Se ver `✅ Conectado com sucesso!` - Parabéns, está tudo funcionando! 🎉

---

## 🐛 Troubleshooting (Resolução de Problemas)

### Problema: `near: command not found`

**Solução:**
```bash
# Reinstalar globalmente
npm install -g near-cli-rs

# Verificar PATH
echo $PATH

# Adicionar ao PATH se necessário
echo 'export PATH="$PATH:~/.npm-global/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Problema: `EACCES` ao instalar globalmente

**Solução:**
```bash
# Configurar npm para usar diretório local
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$PATH:~/.npm-global/bin"' >> ~/.bashrc
source ~/.bashrc

# Instalar novamente
npm install -g near-cli-rs
```

### Problema: Conta sem fundos

**Solução:**
```bash
# Usar faucet
curl -X POST https://near-faucet.io/api/faucet \
  -H "Content-Type: application/json" \
  -d '{"accountId":"seunome.testnet"}'

# Verificar saldo
near state seunome.testnet network-config testnet now
```

### Problema: Node.js versão incorreta

**Solução:**
```bash
# Usar nvm para trocar versão
nvm install 20
nvm use 20
nvm alias default 20
```

---

## 📚 Comandos Úteis da NEAR CLI

### Informações da Conta

```bash
# Ver estado da conta
near account view-account-summary CONTA network-config testnet now

# Listar chaves de acesso
near account list-keys CONTA network-config testnet now

# Ver balanço
near tokens CONTA send-near CONTA 0 network-config testnet sign-with-keychain send
```

### Gerenciar Chaves

```bash
# Adicionar chave
near account add-key CONTA grant-full-access \
  autogenerate-new-keypair save-to-keychain \
  network-config testnet sign-with-keychain send

# Deletar chave
near account delete-key CONTA 'ed25519:CHAVE_PUBLICA' \
  network-config testnet sign-with-keychain send
```

### Contratos

```bash
# Deploy de contrato
near contract deploy CONTA use-file contrato.wasm \
  without-init-call network-config testnet sign-with-keychain send

# Chamar método
near contract call-function as-transaction CONTA metodo \
  json-args '{}' prepaid-gas '30 TeraGas' attached-deposit '0 NEAR' \
  sign-as CONTA network-config testnet sign-with-keychain send
```

---

## 🎯 Checklist Final

Antes de continuar, certifique-se de que:

- ✅ Node.js 20+ instalado e funcionando
- ✅ npm funcionando
- ✅ NEAR CLI instalada e no PATH
- ✅ VS Code instalado com extensões
- ✅ Conta testnet criada e financiada
- ✅ Consegue executar comandos `near`
- ✅ Teste de conexão funcionou
- ✅ Credenciais salvas em `~/.near-credentials`

---

## 🚀 Próximos Passos

Ambiente configurado! Agora vamos aprender sobre Smart Contracts.

👉 [Próximo: Introdução aos Smart Contracts](./05-smart-contracts-introducao.md)

---

## 💡 Dicas Finais

1. **Sempre use testnet primeiro**: Nunca teste em mainnet!
2. **Guarde suas chaves**: Faça backup das credenciais
3. **Use nvm**: Facilita gerenciar versões do Node.js
4. **Organize seus projetos**: Estrutura clara desde o início
5. **Documente**: Escreva READMEs para seus projetos

---

[← Anterior: Conceitos NEAR](./03-conceitos-near.md) | [Voltar ao Índice](../README.md) | [Próximo: Smart Contracts →](./05-smart-contracts-introducao.md)
