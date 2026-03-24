const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Carregar APIs da pasta pages/api
const apiDir = path.join(__dirname, 'pages/api');

if (fs.existsSync(apiDir)) {
  const apiFiles = fs.readdirSync(apiDir);
  
  apiFiles.forEach(file => {
    if (file.endsWith('.js')) {
      const routeName = file.replace('.js', '');
      const routePath = `/api/${routeName}`;
      
      try {
        const handler = require(path.join(apiDir, file));
        
        app.all(routePath, async (req, res) => {
          try {
            await handler(req, res);
          } catch (err) {
            res.status(500).json({ error: err.message });
          }
        });
        
        console.log(`✅ API carregada: ${routePath}`);
      } catch (err) {
        console.log(`⚠️ Erro ao carregar ${routePath}:`, err.message);
      }
    }
  });
}

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
