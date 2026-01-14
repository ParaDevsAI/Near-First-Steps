#!/bin/bash

# Script para compilar o contrato de leilão NEAR

echo "🔨 Compilando contrato de leilão..."

# Verifica se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Cria o diretório build se não existir
mkdir -p build

# Compila o contrato TypeScript
echo "⚙️  Compilando TypeScript para WebAssembly..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Contrato TypeScript compilado com sucesso!"
    echo "📄 Arquivo WASM: build/auction.wasm"
    
    # Mostra o tamanho do arquivo
    SIZE=$(du -h build/auction.wasm | cut -f1)
    echo "📊 Tamanho: $SIZE"
    
    echo ""
    echo "💡 Dica: Também há uma versão JavaScript disponível"
    echo "   Execute 'npm run build:js' para compilar a versão JS"
else
    echo "❌ Erro ao compilar o contrato"
    exit 1
fi
