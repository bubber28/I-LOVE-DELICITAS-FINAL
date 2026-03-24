const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const supabase = require('./lib/supabase');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log('🚀 I Love Delicitas - Servidor iniciado');

// ========== FUNÇÃO PARA SERVIR PÁGINAS ==========
function servePage(pasta) {
  return (req, res) => {
    const caminho = path.join(__dirname, 'pages', pasta, 'code.html');
    if (fs.existsSync(caminho)) {
      res.sendFile(caminho);
    } else {
      res.status(404).send(`<h1>404</h1><p>Página não encontrada</p><a href="/">Voltar</a>`);
    }
  };
}

// ========== ROTAS DA API ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email')
      .eq('email', email)
      .eq('senha', senha)
      .single();
    
    if (error || !data) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    res.json({ success: true, user: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cadastro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nome, email, senha, telefone, created_at: new Date() }])
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, user: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/produtos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true);
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pedidos', async (req, res) => {
  const { itens, total, endereco, usuario_id } = req.body;
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .insert([{ usuario_id, itens: JSON.stringify(itens), total, endereco, status: 'recebido', created_at: new Date() }])
      .select();
    
    if (error) throw error;
    res.json({ success: true, pedido: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ROTAS DO FRONTEND ==========
app.get('/', servePage('p_gina_inicial_i_love_delicitas_1'));
app.get('/login', servePage('login_i_love_delicitas_1'));
app.get('/cadastro', servePage('cadastro_i_love_delicitas_1'));
app.get('/carrinho', servePage('seu_carrinho_i_love_delicitas_1'));
app.get('/admin', servePage('painel_admin_i_love_delicitas_1'));
app.get('/checkout', servePage('checkout_i_love_delicitas'));
app.get('/perfil', servePage('perfil_do_usu_rio_i_love_delicitas'));
app.get('/pedidos', servePage('meus_pedidos_i_love_delicitas_status'));
app.get('/acompanhamento', servePage('acompanhamento_de_pedido_i_love_delicitas'));
app.get('/enderecos', servePage('meus_endere_os_i_love_delicitas'));
app.get('/esqueci-senha', servePage('esqueci_minha_senha_i_love_delicitas_1'));
app.get('/termos', servePage('termos_de_uso_i_love_delicitas'));
app.get('/privacidade', servePage('privacy_policy_i_love_delicitas'));
app.get('/ajuda', servePage('ajuda_e_suporte_i_love_delicitas'));

// Fallback
app.get('*', (req, res) => {
  const caminho = path.join(__dirname, 'pages', req.path.slice(1), 'code.html');
  if (fs.existsSync(caminho)) {
    res.sendFile(caminho);
  } else {
    res.status(404).send(`<h1>404</h1><p>${req.path} não encontrado</p><a href="/">Voltar</a>`);
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  });
}
