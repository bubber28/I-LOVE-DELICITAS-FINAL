require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

// ========== AUTENTICAÇÃO ==========
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, role, name')
      .eq('email', email)
      .single();
    
    if (error || !data) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    res.json({ success: true, user: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== PRODUTOS ==========
app.get('/api/produtos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== CATEGORIAS ==========
app.get('/api/categorias', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CUPONS ==========
app.get('/api/cupons', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cupons')
      .select('*')
      .eq('active', true);
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cupons/validar', async (req, res) => {
  const { code } = req.body;
  try {
    const { data, error } = await supabase
      .from('cupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();
    
    if (error || !data) {
      return res.json({ valid: false, message: 'Cupom inválido' });
    }
    
    const now = new Date();
    const validUntil = new Date(data.valid_until);
    
    if (validUntil && now > validUntil) {
      return res.json({ valid: false, message: 'Cupom expirado' });
    }
    
    res.json({ valid: true, coupon: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== BANNERS ==========
app.get('/api/banners', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('active', true)
      .order('display_order');
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CONFIGURAÇÕES DO APP ==========
app.get('/api/config', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('app_config')
      .select('*');
    
    if (error) throw error;
    const config = {};
    data.forEach(item => { config[item.key] = item.value; });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== PEDIDOS ==========
// Criar pedido
app.post('/api/pedidos', async (req, res) => {
  const { items, total, customer_name, customer_phone, address, user_id } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        items: JSON.stringify(items),
        total,
        customer_name,
        customer_phone,
        address,
        user_id: user_id || null,
        status: 'pending',
        payment_status: 'awaiting',
        tracking_code: generateTrackingCode(),
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    
    res.json({ 
      success: true, 
      order: data[0],
      message: 'Pedido realizado com sucesso!',
      tracking_code: data[0].tracking_code
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: error.message });
  }
});

// Listar pedidos de um usuário
app.get('/api/pedidos/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar pedido por código de rastreio
app.get('/api/acompanhamento/:tracking_code', async (req, res) => {
  const { tracking_code } = req.params;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('tracking_code', tracking_code)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar status do pedido (admin)
app.put('/api/pedidos/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;
  
  try {
    const updateData = {};
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;
    if (status === 'preparing') updateData.preparing_at = new Date().toISOString();
    if (status === 'delivering') updateData.delivering_at = new Date().toISOString();
    if (status === 'delivered') updateData.delivered_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json({ success: true, order: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Função para gerar código de rastreio
function generateTrackingCode() {
  const prefix = 'DEL';
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${day}${month}${year}${random}`;
}

// ========== ROTAS DO FRONTEND ==========
app.get('/', servePage('p_gina_inicial_i_love_delicitas_1'));
app.get('/login', servePage('login_i_love_delicitas_1'));
app.get('/entrar', servePage('login_i_love_delicitas_1'));
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
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>404 - I Love Delicitas</title></head>
      <body style="font-family: system-ui; text-align: center; padding: 50px;">
        <h1>🍟 404</h1>
        <p>Página não encontrada: ${req.path}</p>
        <a href="/" style="color: #4CAF50;">Voltar para o início</a>
      </body>
      </html>
    `);
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  });
}
