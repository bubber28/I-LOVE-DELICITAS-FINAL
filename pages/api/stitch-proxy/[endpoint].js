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
