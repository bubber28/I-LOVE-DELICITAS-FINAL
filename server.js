const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log('🚀 Iniciando servidor I Love Delicitas...');

// ============================================
// ROTAS DA API
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/login', (req, res) => {
  res.json({ success: true, message: 'Login realizado' });
});

app.get('/api/produtos', (req, res) => {
  res.json([
    { id: 1, nome: 'Coxinha', preco: 5.00 },
    { id: 2, nome: 'Risole', preco: 4.50 },
    { id: 3, nome: 'Kibe', preco: 5.00 },
    { id: 4, nome: 'Bolinha de Queijo', preco: 3.50 }
  ]);
});

app.post('/api/pedidos', (req, res) => {
  res.json({ success: true, pedidoId: Date.now() });
});

// ============================================
// FUNÇÃO PARA SERVIR PÁGINAS
// ============================================
function servePage(pasta) {
  return (req, res) => {
    const caminho = path.join(__dirname, 'pages', pasta, 'code.html');
    if (fs.existsSync(caminho)) {
      res.sendFile(caminho);
    } else {
      res.status(404).send(`<h1>404</h1><p>Página não encontrada: ${req.path}</p><a href="/">Voltar</a>`);
    }
  };
}

// ============================================
// TODAS AS ROTAS DO SISTEMA - LISTA COMPLETA
// ============================================

// Páginas iniciais
app.get('/', servePage('p_gina_inicial_i_love_delicitas_1'));
app.get('/inicio', servePage('p_gina_inicial_i_love_delicitas_1'));
app.get('/inicio2', servePage('p_gina_inicial_i_love_delicitas_2'));
app.get('/inicio3', servePage('p_gina_inicial_i_love_delicitas_3'));

// Autenticação e perfil
app.get('/login', servePage('login_i_love_delicitas_1'));
app.get('/login2', servePage('login_i_love_delicitas_2'));
app.get('/cadastro', servePage('cadastro_i_love_delicitas_1'));
app.get('/cadastro2', servePage('cadastro_i_love_delicitas_2'));
app.get('/cadastro-atualizado', servePage('cadastro_atualizado_i_love_delicitas'));
app.get('/perfil', servePage('perfil_do_usu_rio_i_love_delicitas'));
app.get('/perfil/editar', servePage('perfil_atualizado_i_love_delicitas_1'));
app.get('/perfil/editar2', servePage('perfil_atualizado_i_love_delicitas_2'));
app.get('/enderecos', servePage('meus_endere_os_i_love_delicitas'));
app.get('/enderecos/editar', servePage('editar_endere_o_i_love_delicitas'));
app.get('/logout', servePage('confirma_o_de_logout_i_love_delicitas'));

// Carrinho e checkout
app.get('/carrinho', servePage('seu_carrinho_i_love_delicitas_1'));
app.get('/carrinho2', servePage('seu_carrinho_i_love_delicitas_2'));
app.get('/carrinho3', servePage('seu_carrinho_i_love_delicitas_3'));
app.get('/checkout', servePage('checkout_i_love_delicitas'));
app.get('/checkout/pagamento', servePage('checkout_i_love_delicitas_pagamento'));
app.get('/checkout/atualizado', servePage('checkout_atualizado_i_love_delicitas_1'));
app.get('/checkout/atualizado2', servePage('checkout_atualizado_i_love_delicitas_2'));
app.get('/checkout/pix', servePage('checkout_com_pix_i_love_delicitas'));
app.get('/checkout/stripe', servePage('checkout_com_stripe_i_love_delicitas'));
app.get('/pagamento/pix', servePage('pagamento_pix_i_love_delicitas'));
app.get('/pagamento/cartao', servePage('pagamento_com_cart_o_i_love_delicitas'));

// Pedidos e acompanhamento
app.get('/pedidos', servePage('meus_pedidos_i_love_delicitas_status'));
app.get('/acompanhamento', servePage('acompanhamento_de_pedido_i_love_delicitas'));
app.get('/pedido/confirmado', servePage('pedido_confirmado_i_love_delicitas_1'));
app.get('/pedido/confirmado2', servePage('pedido_confirmado_i_love_delicitas_2'));
app.get('/pedido/confirmado-doce', servePage('pedido_confirmado_doce_cora_o'));
app.get('/pedido/pago', servePage('pedido_pago_i_love_delicitas'));

// Admin - principal
app.get('/admin', servePage('painel_admin_i_love_delicitas_1'));
app.get('/admin2', servePage('painel_admin_i_love_delicitas_2'));
app.get('/admin/cores', servePage('painel_admin_cores_personalizadas'));
app.get('/admin/dashboard', servePage('dashboard_admin_mobile'));

// Admin - produtos e estoque
app.get('/admin/produtos', servePage('gerenciar_produtos_admin'));
app.get('/admin/produtos/adicionar', servePage('adicionar_produto_admin'));
app.get('/admin/estoque', servePage('gest_o_de_produtos_admin_cores_novas'));

// Admin - categorias
app.get('/admin/categorias', servePage('gerenciar_categorias_admin'));

// Admin - pedidos
app.get('/admin/pedidos', servePage('gerenciar_pedidos_admin'));
app.get('/admin/pedidos/som', servePage('gerenciar_pedidos_admin_som_pagamento'));
app.get('/admin/pedidos/cores', servePage('gest_o_de_pedidos_admin_cores_novas'));

// Admin - cupons
app.get('/admin/cupons', servePage('gerenciar_cupons_admin_1'));
app.get('/admin/cupons2', servePage('gerenciar_cupons_admin_2'));
app.get('/admin/cupons/criar', servePage('criar_cupom_admin'));

// Admin - clientes
app.get('/admin/clientes', servePage('lista_de_clientes_admin'));

// Admin - configurações
app.get('/admin/configuracoes', servePage('configura_es_do_app_admin'));

// Admin - relatórios
app.get('/admin/relatorios', servePage('relat_rios_de_vendas_admin'));
app.get('/admin/relatorios/status', servePage('relat_rio_de_status_i_love_delicitas'));

// Recuperar senha
app.get('/esqueci-senha', servePage('esqueci_minha_senha_i_love_delicitas_1'));
app.get('/esqueci-senha2', servePage('esqueci_minha_senha_i_love_delicitas_2'));
app.get('/sucesso-senha', servePage('sucesso_redefini_o_de_senha_1'));
app.get('/sucesso-senha2', servePage('sucesso_redefini_o_de_senha_2'));
app.get('/sucesso-senha-doce', servePage('sucesso_redefini_o_de_senha_doce_cora_o'));

// Páginas institucionais
app.get('/termos', servePage('termos_de_uso_i_love_delicitas'));
app.get('/privacidade', servePage('privacy_policy_i_love_delicitas'));
app.get('/ajuda', servePage('ajuda_e_suporte_i_love_delicitas'));
app.get('/suporte', servePage('ajuda_e_suporte_i_love_delicitas'));

// Mídias e branding
app.get('/logo', servePage('cat_logo_de_doces_i_love_delicitas_1'));
app.get('/logo2', servePage('cat_logo_de_doces_i_love_delicitas_2'));
app.get('/logo3', servePage('cat_logo_de_doces_i_love_delicitas_3'));
app.get('/banner', servePage('cat_logo_de_doces_i_love_delicitas_1'));
app.get('/cardapio', servePage('cat_logo_de_doces_i_love_delicitas_1'));
app.get('/imagens', servePage('cat_logo_de_doces_i_love_delicitas_1'));

// Estilo e tema
app.get('/tema', servePage('sugar_rush_modern'));
app.get('/style', servePage('sugar_rush_modern'));

// Produto individual
app.get('/produto', servePage('prd_i_love_delicitas'));

// ============================================
// FALLBACK - Tenta encontrar qualquer página
// ============================================
app.get('*', (req, res) => {
  const urlPath = req.path.slice(1);
  const possiveisPastas = [
    urlPath,
    urlPath.replace(/\//g, '_'),
    `${urlPath}_i_love_delicitas_1`,
    `${urlPath}_i_love_delicitas`,
    urlPath.replace(/-/g, '_')
  ];
  
  for (const pasta of possiveisPastas) {
    const caminho = path.join(__dirname, 'pages', pasta, 'code.html');
    if (fs.existsSync(caminho)) {
      return res.sendFile(caminho);
    }
  }
  
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head><title>404 - I Love Delicitas</title></head>
    <body style="font-family: system-ui; text-align: center; padding: 50px;">
      <h1>🍟 404</h1>
      <p>Página não encontrada: ${req.path}</p>
      <p><a href="/" style="color: #4CAF50;">Voltar para o início</a></p>
    </body>
    </html>
  `);
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🚀 I Love Delicitas - Servidor Rodando!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📡 Local: http://localhost:${port}`);
    console.log(`📡 API: http://localhost:${port}/api/health`);
    console.log('═══════════════════════════════════════════════════════════');
  });
}
