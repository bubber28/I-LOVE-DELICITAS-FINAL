#!/bin/bash
echo "════════════════════════════════════════════════════════"
echo "🔍 VERIFICANDO CORREÇÕES APLICADAS"
echo "════════════════════════════════════════════════════════"
echo ""

Verificar estrutura
echo "✅ Verificando estrutura de API routes:"
if [ -d "pages/api" ]; then
echo " ✓ pages/api existe"
echo " Rotas disponíveis:"
ls pages/api/ 2>/dev/null | sed 's/^/ - /'
else
echo " ✗ pages/api NÃO encontrado"
fi

echo ""
echo "✅ Verificando arquivos de configuração:"
[ -f "lib/stitch-client.js" ] && echo " ✓ lib/stitch-client.js" || echo " ✗ lib/stitch-client.js"
[ -f ".env.local" ] && echo " ✓ .env.local" || echo " ⚠ .env.local (crie a partir do template)"

echo ""
echo "✅ Verificando dependências:"
if [ -f "package.json" ]; then
if ! grep -q "mongodb-stitch" package.json; then
echo " ⚠ Adicione a dependência: npm install mongodb-stitch-server-sdk"
fi
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "📋 PRÓXIMOS PASSOS:"
echo "════════════════════════════════════════════════════════"
echo ""
echo "1. Configure os HTTP Endpoints no MongoDB Stitch"
echo " ➜ Siga as instruções em STITCH-SETUP.md"
echo ""
echo "2. Atualize o arquivo .env.local com seu STITCH_APP_ID"
echo ""
echo "3. Instale dependências (se necessário):"
echo " npm install mongodb-stitch-server-sdk"
echo ""
echo "4. Teste a API localmente:"
echo " npm run dev"
echo " curl http://localhost:3000/api/health"
echo ""
echo "5. Faça deploy no Vercel com as variáveis de ambiente"
echo ""
echo "════════════════════════════════════════════════════════"
