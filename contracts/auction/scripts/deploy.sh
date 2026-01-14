#!/bin/bash

# Script para fazer deploy do contrato de leilão NEAR

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Deploy do contrato de leilão NEAR"
echo ""

# Verifica se o arquivo WASM existe
if [ ! -f "build/auction.wasm" ]; then
    echo -e "${RED}❌ Arquivo build/auction.wasm não encontrado${NC}"
    echo "Execute 'npm run build' primeiro"
    exit 1
fi

# Solicita o ID da conta (ou usa o argumento)
if [ -z "$1" ]; then
    echo -e "${YELLOW}Digite o ID da conta para deploy (ex: meu-contrato.testnet):${NC}"
    read ACCOUNT_ID
else
    ACCOUNT_ID=$1
fi

if [ -z "$ACCOUNT_ID" ]; then
    echo -e "${RED}❌ ID da conta é obrigatório${NC}"
    exit 1
fi

echo ""
echo "📋 Informações do deploy:"
echo "  Conta: $ACCOUNT_ID"
echo "  Arquivo: build/auction.wasm"
echo ""

# Faz o deploy
echo "⏳ Fazendo deploy..."
near deploy --accountId "$ACCOUNT_ID" --wasmFile build/auction.wasm

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deploy realizado com sucesso!${NC}"
    echo ""
    echo "📝 Próximos passos:"
    echo "1. Inicialize o leilão com um NFT:"
    echo "   FIVE_MINUTES=\$(( \$(date +%s%N) + 5 * 60 * 1000000000 ))"
    echo "   near call $ACCOUNT_ID init '{\"end_time\": \"'\$FIVE_MINUTES'\", \"auctioneer\": \"leiloeiro.testnet\", \"nft_contract\": \"nft-contrato.testnet\", \"token_id\": \"1\"}' --accountId $ACCOUNT_ID"
    echo ""
    echo "2. Faça um lance:"
    echo "   near call $ACCOUNT_ID bid '{}' --accountId sua-conta.testnet --deposit 1"
    echo ""
    echo "3. Consulte o maior lance:"
    echo "   near view $ACCOUNT_ID get_highest_bid"
    echo ""
    echo "4. Após o término, finalize (vencedor recebe NFT):"
    echo "   near call $ACCOUNT_ID claim '{}' --accountId qualquer-conta.testnet"
else
    echo -e "${RED}❌ Erro ao fazer deploy${NC}"
    exit 1
fi
