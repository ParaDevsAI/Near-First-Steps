#!/bin/bash

# Script para testar o contrato de leilão NEAR

echo "🧪 Executando testes do contrato..."
echo ""

# Verifica se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Compila o contrato antes dos testes
echo "🔨 Compilando contrato..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar o contrato"
    exit 1
fi

echo ""
echo "▶️  Executando testes..."
echo ""

# Executa os testes
npm test

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Todos os testes passaram!"
else
    echo ""
    echo "❌ Alguns testes falharam"
    exit 1
fi
