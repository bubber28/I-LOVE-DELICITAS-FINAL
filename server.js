require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const supabase = require('./lib/supabase');

const app = express();
const port = process.env.PORT || 3000;

// Configurações de Segurança e Dados
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Aqui ficam suas imagens e estilos globais

console.log('🚀 I Love Delicitas - Servidor iniciado');

// Função Mestra: Ela busca a página no caminho correto sem quebrar o estilo
function servePage(pasta) {
    return (req, res) => {
        const caminho = path.join(__dirname, 'pages', pasta, 'code.html');
        if (fs.existsSync(caminho)) {
            res.sendFile(caminho);
        } else {
            res.status(404).send('Página não encontrada no servidor.');
        }
    };
}

// ========== API DE PRODUTOS (Para alimentar sua vitrine) ==========
app.get('/api/produtos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .eq('active', true)
            .order('name');
            
        if (error) throw error;
        
        const produtosFormatados = data.map(p => ({ 
            ...p, 
            price: p.price_cents / 100 
        }));
        
        res.json(produtosFormatados || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== API DE CADASTRO ==========
app.post('/api/cadastro', async (req, res) => {
    const { nome, email, telefone, senha } = req.body;
    try {
        const { data, error } = await supabase.from('profiles').insert([{ 
            id: crypto.randomUUID(), 
            name: nome, 
            email: email, 
            phone: telefone 
        }]);
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== ROTAS DO SEU APP (Caminhos que você já criou) ==========
app.get('/', servePage('pagina_inicial_i_love_delicitas_1'));
app.get('/login', servePage('login_i_love_delicitas_1'));
app.get('/cadastro', servePage('cadastro_i_love_delicitas_1'));
app.get('/carrinho', servePage('seu_carrinho_i_love_delicitas_1'));
app.get('/admin', servePage('painel_admin_i_love_delicitas_1'));
app.get('/checkout', servePage('checkout_i_love_delicitas'));
app.get('/perfil', servePage('perfil_do_usu_rio_i_love_delicitas'));

// Rota curinga para qualquer outra página que você criar
app.get('*', (req, res) => {
    const pasta = req.path.slice(1);
    const caminho = path.join(__dirname, 'pages', pasta, 'code.html');
    if (fs.existsSync(caminho)) {
        res.sendFile(caminho);
    } else {
        res.status(404).send('Página não encontrada');
    }
});

app.listen(port, () => console.log(`🚀 I Love Delicitas rodando na porta ${port}`));
