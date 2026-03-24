#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "🔧 DIAGNÓSTICO E CORREÇÃO DO SISTEMA - I LOVE DELICITAS"
echo "════════════════════════════════════════════════════════"
echo ""

# 1. DIAGNÓSTICO DA ESTRUTURA ATUAL
echo "📁 [1/6] ANALISANDO ESTRUTURA DO PROJETO..."
echo "────────────────────────────────────────────────────────"

# Verificar estrutura do Next.js ou React
if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"
    
    # Verificar framework
    if grep -q "next" package.json; then
        echo "📌 Framework: Next.js"
        FRAMEWORK="next"
        
        # Verificar estrutura de API routes
        if [ -d "pages/api" ]; then
            echo "📂 API routes encontradas em: pages/api/"
            echo "   Rotas disponíveis:"
            ls -la pages/api/ 2>/dev/null | grep -E "\.(js|ts)$" || echo "   ⚠️ Nenhuma rota encontrada"
        elif [ -d "app/api" ]; then
            echo "📂 API routes encontradas em: app/api/ (App Router)"
            find app/api -name "route.js" -o -name "route.ts" 2>/dev/null
        else
            echo "⚠️ Nenhuma pasta de API routes encontrada!"
            echo "   ➜ Isso pode ser a causa do erro 404"
        fi
    else
        echo "📌 Framework: React/Outro"
        FRAMEWORK="react"
    fi
    
    # Verificar dependências do Stitch
    echo ""
    echo "📦 Dependências do Stitch:"
    grep -E "stitch|mongodb" package.json || echo "   ⚠️ Nenhuma dependência do Stitch encontrada"
else
    echo "❌ package.json não encontrado!"
    echo "   Certifique-se de estar no diretório correto do projeto"
    exit 1
fi

echo ""
echo "🌐 [2/6] ANALISANDO CONFIGURAÇÕES DE AMBIENTE..."
echo "────────────────────────────────────────────────────────"

# Verificar arquivos de ambiente
if [ -f ".env.local" ]; then
    echo "✅ .env.local encontrado"
    echo "   Variáveis configuradas:"
    grep -E "STITCH|MONGODB|API" .env.local | sed 's/=.*/=***/' || echo "   ⚠️ Nenhuma variável do Stitch encontrada"
else
    echo "⚠️ .env.local não encontrado"
    echo "   ➜ Criando template..."
    cat > .env.local.template << 'ENVEOF'
# MongoDB Stitch Configuration
STITCH_APP_ID=seu-app-id-aqui
STITCH_REGION=us-east-1
STITCH_API_URL=https://${STITCH_REGION}.aws.data.mongodb-api.com/app/${STITCH_APP_ID}/endpoint

# Database
MONGODB_URI=sua-mongodb-uri
DB_NAME=delicitas

# App Config
NEXT_PUBLIC_API_URL=https://us-east-1.aws.data.mongodb-api.com/app/SEU-APP-ID/endpoint
ENVEOF
    echo "   ✅ Template criado: .env.local.template"
    echo "   ➜ Renomeie para .env.local e preencha com seus dados"
fi

echo ""
echo "🔍 [3/6] VERIFICANDO CHAMADAS DE API NO FRONTEND..."
echo "────────────────────────────────────────────────────────"

# Buscar chamadas fetch/axios no código
echo "Buscando chamadas de API no código fonte..."
grep -r --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" \
  -E "(fetch|axios)\\(['\"\\/](api|\\/)" . 2>/dev/null | head -10 || echo "   ℹ️ Nenhuma chamada relativa encontrada"

echo ""
echo "Buscando URLs hardcoded..."
grep -r --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" \
  -E "(https?:\\/\\/.*\\.mongodb-api\\.com|localhost:3000)" . 2>/dev/null | head -5 || echo "   ℹ️ Nenhuma URL hardcoded encontrada"

echo ""
echo "📝 [4/6] CRIANDO ESTRUTURA CORRETA DAS API ROUTES..."
echo "────────────────────────────────────────────────────────"

if [ "$FRAMEWORK" = "next" ]; then
    # Criar estrutura de API routes
    echo "Criando estrutura de API routes para Next.js..."
    
    mkdir -p pages/api
    mkdir -p pages/api/produtos
    mkdir -p pages/api/pedidos
    mkdir -p pages/api/categorias
    mkdir -p pages/api/login
    mkdir -p pages/api/carrinho
    
    # Criar arquivo de configuração central
    cat > lib/stitch-client.js << 'STITCHEOF'
// lib/stitch-client.js
// Cliente centralizado para MongoDB Stitch

const STITCH_APP_ID = process.env.STITCH_APP_ID;
const STITCH_REGION = process.env.STITCH_REGION || 'us-east-1';

export const STITCH_API_URL = `https://${STITCH_REGION}.aws.data.mongodb-api.com/app/${STITCH_APP_ID}/endpoint`;

export async function stitchRequest(endpoint, options = {}) {
  const url = `${STITCH_API_URL}/${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro na chamada para ${endpoint}:`, error);
    throw error;
  }
}

// Funções específicas
export const produtosAPI = {
  listar: () => stitchRequest('produtos'),
  buscar: (id) => stitchRequest(`produto?id=${id}`),
};

export const pedidosAPI = {
  criar: (pedido) => stitchRequest('pedidos', {
    method: 'POST',
    body: JSON.stringify(pedido),
  }),
  listar: () => stitchRequest('pedidos'),
};

export const categoriasAPI = {
  listar: () => stitchRequest('categorias'),
};

export const loginAPI = {
  autenticar: (credenciais) => stitchRequest('login', {
    method: 'POST',
    body: JSON.stringify(credenciais),
  }),
};

export const carrinhoAPI = {
  adicionar: (item) => stitchRequest('carrinho', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
};
STITCHEOF
    
    echo "✅ lib/stitch-client.js criado"
    
    # Criar exemplo de API route
    cat > pages/api/health.js << 'HEALTHEOF'
// pages/api/health.js
// Endpoint de health check

export default async function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'API funcionando corretamente'
  });
}
HEALTHEOF
    
    echo "✅ pages/api/health.js criado"
    
    # Criar exemplo de integração com Stitch
    cat > pages/api/stitch-proxy/[endpoint].js << 'PROXYEOF'
// pages/api/stitch-proxy/[endpoint].js
// Proxy para chamadas ao MongoDB Stitch

import { STITCH_API_URL } from '../../../lib/stitch-client';

export default async function handler(req, res) {
  const { endpoint } = req.query;
  const { method, body, headers } = req;
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  try {
    const url = `${STITCH_API_URL}/${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });
    
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`Erro no proxy para ${endpoint}:`, error);
    res.status(500).json({ 
      error: 'Erro ao comunicar com o Stitch',
      details: error.message 
    });
  }
}
PROXYEOF
    
    echo "✅ pages/api/stitch-proxy/[endpoint].js criado"
    
fi

echo ""
echo "⚙️ [5/6] GERANDO INSTRUÇÕES PARA O MONGODB STITCH..."
echo "────────────────────────────────────────────────────────"

cat > STITCH-SETUP.md << 'STITCHEOF'
# 🍢 Configuração dos HTTP Endpoints no MongoDB Stitch

## 📋 Passo a Passo

### 1. Acesse o MongoDB Atlas
- Vá para https://cloud.mongodb.com
- Selecione seu projeto e App Services

### 2. Criar os HTTP Endpoints

Crie os seguintes endpoints no console:

| Endpoint | Método | Função |
|----------|--------|--------|
| `produtos` | GET | Listar salgadinhos |
| `produto` | GET | Buscar um produto específico |
| `pedidos` | POST | Criar novo pedido |
| `pedidos` | GET | Listar pedidos do usuário |
| `categorias` | GET | Listar categorias |
| `login` | POST | Autenticação |
| `carrinho` | POST | Gerenciar carrinho |

### 3. Código para cada endpoint

#### Endpoint: `produtos` (GET)
```javascript
exports = async function(payload, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  
  if (payload.method === 'OPTIONS') {
    response.setStatusCode(204);
    return;
  }
  
  try {
    const collection = context.services
      .get('mongodb-atlas')
      .db('delicitas')
      .collection('produtos');
    
    const produtos = await collection.find({ 
      ativo: true,
      categoria: { $in: ['coxinha', 'risole', 'kibe', 'bolinha'] }
    }).toArray();
    
    response.setStatusCode(200);
    return produtos;
  } catch (err) {
    response.setStatusCode(500);
    return { error: err.message };
  }
};
Endpoint: pedidos (POST)
javascript
exports = async function(payload, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  
  if (payload.method === 'OPTIONS') {
    response.setStatusCode(204);
    return;
  }
  
  try {
    const pedido = JSON.parse(payload.body.text());
    
    const collection = context.services
      .get('mongodb-atlas')
      .db('delicitas')
      .collection('pedidos');
    
    const result = await collection.insertOne({
      ...pedido,
      dataCriacao: new Date(),
      status: 'pendente',
      tipo: 'salgadinho'
    });
    
    response.setStatusCode(201);
    return { 
      success: true, 
      id: result.insertedId,
      mensagem: 'Pedido recebido!' 
    };
  } catch (err) {
    response.setStatusCode(400);
    return { error: err.message };
  }
};
4. Configurar CORS
Adicione no App Services > CORS Origins:

https://i-love-delicitas-final-98rk.vercel.app

http://localhost:3000

5. Obter seu App ID
Seu App ID está em App Services > Settings
Formato: seu-app-nome-abcde

6. Atualizar .env.local
text
STITCH_APP_ID=seu-app-id-aqui
STITCH_REGION=us-east-1
NEXT_PUBLIC_API_URL=https://us-east-1.aws.data.mongodb-api.com/app/seu-app-id/endpoint
STITCHEOF

echo "✅ STITCH-SETUP.md criado com instruções detalhadas"

echo ""
echo "🔧 [6/6] CORREÇÕES AUTOMÁTICAS APLICADAS..."
echo "────────────────────────────────────────────────────────"

Criar script de verificação
cat > verify-fix.sh << 'VERIFYEOF'
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
VERIFYEOF

chmod +x verify-fix.sh

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ DIAGNÓSTICO E CORREÇÕES CONCLUÍDOS!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📂 Arquivos criados:"
echo " • lib/stitch-client.js - Cliente centralizado do Stitch"
echo " • pages/api/health.js - Endpoint de health check"
echo " • pages/api/stitch-proxy/[endpoint].js - Proxy para Stitch"
echo " • STITCH-SETUP.md - Instruções completas do Stitch"
echo " • .env.local.template - Template de variáveis de ambiente"
echo " • verify-fix.sh - Script de verificação"
echo ""
echo "🚀 Execute agora: ./verify-fix.sh"
echo ""

