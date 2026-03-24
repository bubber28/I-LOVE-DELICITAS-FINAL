const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ========== API (SUAS FUNÇÕES DO STITCH VIRAM AQUI) ==========
// Exemplo de rota de login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    // Aqui você coloca a lógica que estava no Stitch
    // Ou chama o Stitch via fetch se preferir
    res.json({ success: true, message: 'Login realizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exemplo de rota de produtos
app.get('/api/produtos', async (req, res) => {
  try {
    // Buscar produtos do banco
    res.json([{ id: 1, nome: 'Coxinha', preco: 5.00 }]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exemplo de rota de pedidos
app.post('/api/pedidos', async (req, res) => {
  const { itens, total } = req.body;
  try {
    res.json({ success: true, pedidoId: Date.now() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== FRONTEND (TODAS AS PÁGINAS VIRAM ROTAS) ==========
// Função para servir páginas HTML
function servirPagina(nomePasta, nomeArquivo = 'code.html') {
  const caminho = path.join(__dirname, 'pages', nomePasta, nomeArquivo);
  if (fs.existsSync(caminho)) {
    return res.sendFile(caminho);
  }
  return res.status(404).send('Página não encontrada');
}

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/p_gina_inicial_i_love_delicitas_1/code.html'));
});

// Login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/login_i_love_delicitas_1/code.html'));
});

// Cadastro
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/cadastro_i_love_delicitas_1/code.html'));
});

// Carrinho
app.get('/carrinho', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/seu_carrinho_i_love_delicitas_1/code.html'));
});

// Admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/painel_admin_i_love_delicitas_1/code.html'));
});

// Checkout
app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/checkout_i_love_delicitas/code.html'));
});

// Perfil
app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/perfil_do_usu_rio_i_love_delicitas/code.html'));
});

// Pedidos
app.get('/pedidos', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/meus_pedidos_i_love_delicitas_status/code.html'));
});

// Fallback para qualquer outra rota
app.get('*', (req, res) => {
  const rota = req.params[0] || req.path.slice(1);
  const caminhoPossivel = path.join(__dirname, 'pages', rota, 'code.html');
  
  if (fs.existsSync(caminhoPossivel)) {
    res.sendFile(caminhoPossivel);
  } else {
    res.status(404).send(`
      <h1>Página não encontrada</h1>
      <p>A página que você tentou acessar não existe.</p>
      <a href="/">Voltar para o início</a>
    `);
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
