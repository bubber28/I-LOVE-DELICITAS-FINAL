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