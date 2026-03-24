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
app.use(express.static('public'));

function servePage(pasta) {
    return (req, res) => {
        const caminho = path.join(__dirname, 'pages', pasta, 'code.html');
        if (fs.existsSync(caminho)) {
            res.sendFile(caminho);
        } else {
            res.status(404).send('<h1>404</h1><p>Pagina nao encontrada</p><a href="/">Voltar</a>');
        }
    };
}

app.get('/api/produtos', async (req, res) => {
    try {
        const { data, error } = await supabase.from('products').select('*').eq('active', true).order('name');
        if (error) throw error;
        const produtosFormatados = data.map(p => ({ ...p, price: p.price_cents / 100 }));
        res.json(produtosFormatados || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/categorias', async (req, res) => {
    try {
        const { data, error } = await supabase.from('categories').select('id, name').order('name');
        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        const ordersFormatadas = data.map(o => ({ ...o, total: o.total_cents / 100 }));
        res.json(ordersFormatadas || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pedidos', async (req, res) => {
    const { customer_name, customer_phone, items, total_cents } = req.body;
    try {
        const { data: order, error } = await supabase
            .from('orders')
            .insert([{ customer_name, customer_phone, status: 'received', total_cents, created_at: new Date().toISOString() }])
            .select()
            .single();
        if (error) throw error;
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/acompanhamento/:id', async (req, res) => {
    try {
        const { data, error } = await supabase.from('orders').select('*').eq('id', req.params.id).single();
        if (error || !data) return res.status(404).json({ error: 'Pedido nao encontrado' });
        res.json({ ...data, total: data.total_cents / 100 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', servePage('p_gina_inicial_i_love_delicitas_1'));
app.get('/login', servePage('login_i_love_delicitas_1'));
app.get('/cadastro', servePage('cadastro_i_love_delicitas_1'));
app.get('/carrinho', servePage('seu_carrinho_i_love_delicitas_1'));
app.get('/admin', servePage('painel_admin_i_love_delicitas_1'));
app.get('/checkout', servePage('checkout_i_love_delicitas'));
app.get('/acompanhamento', servePage('acompanhamento_de_pedido_i_love_delicitas'));

app.get('*', (req, res) => {
    const caminho = path.join(__dirname, 'pages', req.path.slice(1), 'code.html');
    if (fs.existsSync(caminho)) {
        res.sendFile(caminho);
    } else {
        res.status(404).send('<h1>404</h1><p>Pagina nao encontrada</p><a href="/">Voltar</a>');
    }
});

module.exports = app;
if (require.main === module) app.listen(port, () => console.log('Servidor rodando na porta ' + port));
