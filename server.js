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

function servePage(pasta) {
    return (req, res) => {
        const caminho = path.join(__dirname, 'pages', pasta, 'code.html');
        if (fs.existsSync(caminho)) {
            res.sendFile(caminho);
        } else {
            res.status(404).send('Pagina nao encontrada');
        }
    };
}

// Rota para buscar produtos no Banco de Dados
app.get('/api/produtos', async (req, res) => {
    try {
        const { data, error } = await supabase.from('products').select('*').eq('active', true);
        if (error) throw error;
        const produtosFormatados = data.map(p => ({ ...p, price: p.price_cents / 100 }));
        res.json(produtosFormatados || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas das Páginas
app.get('/', servePage('p_gina_inicial_i_love_delicitas_1'));
app.get('/cadastro', servePage('cadastro_i_love_delicitas_1'));

app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`));
