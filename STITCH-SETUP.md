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
