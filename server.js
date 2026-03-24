require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const supabase = require('./lib/supabase');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

console.log('Servidor I Love Delicitas iniciado');

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

app.post('/api/cadastro', async (req, res) => {
    const { nome, email, telefone, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha sao obrigatorios' });
    }
    try {
        const { data: existente } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (existente) {
            return res.status(400).json({ error: 'Email ja cadastrado' });
        }
        const { data, error } = await supabase
            .from('profiles')
            .insert([{
                id: crypto.randomUUID(),
                name: nome,
                phone: telefone || null,
                email: email,
                created_at: new Date().toISOString()
            }])
            .select();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ success: true, user: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const { data: admin } = await supabase
            .from('admin_users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (admin) {
            return res.json({ success: true, user: { email: admin.email, role: 'admin' } });
        }
        const { data: cliente, error } = await supabase
            .from('profiles')
            .select('id, name, email, phone')
            .eq('email', email)
            .maybeSingle();

        if (error || !cliente) {
            return res.status(401).json({ error: 'Email ou senha invalidos' });
        }
        res.json({ success: true, user: cliente });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/produtos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('active', true)
            .order('name');
        if (error) throw error;
        const produtos = data.map(p => ({ ...p, price: p.price_cents / 100 }));
        res.json(produtos || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/categorias', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');
        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        const pedidos = data.map(o => ({ ...o, total: o.total_cents / 100 }));
        res.json(pedidos || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pedidos', async (req, res) => {
    const { customer_name, customer_phone, items, total_cents } = req.body;
    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                customer_name,
                customer_phone,
                status: 'received',
                total_cents,
                items,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        if (error) throw error;
        res.json({ success: true, order: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/acompanhamento/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', req.params.id)
            .single();
        if (error || !data) {
            return res.status(404).json({ error: 'Pedido nao encontrado' });
        }
        res.json({ ...data, total: data.total_cents / 100 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/dashboard', async (req, res) => {
    try {
        const [pedidos, produtos] = await Promise.all([
            supabase.from('orders').select('total_cents'),
            supabase.from('products').select('id', { count: 'exact' })
        ]);
        const totalPedidos = pedidos.data?.length || 0;
        const totalProdutos = produtos.count || 0;
        const totalVendas = pedidos.data?.reduce((sum, o) => sum + o.total_cents, 0) / 100 || 0;
        res.json({ totalPedidos, totalProdutos, totalVendas });
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
app.get('/perfil', servePage('perfil_do_usu_rio_i_love_delicitas'));
app.get('/pedidos', servePage('meus_pedidos_i_love_delicitas_status'));
app.get('/acompanhamento', servePage('acompanhamento_de_pedido_i_love_delicitas'));
app.get('/enderecos', servePage('meus_endere_os_i_love_delicitas'));
app.get('/esqueci-senha', servePage('esqueci_minha_senha_i_love_delicitas_1'));
app.get('/termos', servePage('termos_de_uso_i_love_delicitas'));
app.get('/privacidade', servePage('privacy_policy_i_love_delicitas'));
app.get('/ajuda', servePage('ajuda_e_suporte_i_love_delicitas'));

app.get('*', (req, res) => {
    const caminho = path.join(__dirname, 'pages', req.path.slice(1), 'code.html');
    if (fs.existsSync(caminho)) {
        res.sendFile(caminho);
    } else {
        res.status(404).send('<h1>404</h1><p>Pagina nao encontrada</p><a href="/">Voltar</a>');
    }
});

module.exports = app;
if (require.main === module) app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
