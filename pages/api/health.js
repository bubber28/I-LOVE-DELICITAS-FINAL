// pages/api/health.js
// Endpoint de health check

export default async function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'API funcionando corretamente'
  });
}
