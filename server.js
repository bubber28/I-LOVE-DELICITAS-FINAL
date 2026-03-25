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
            res.status(404).send('Pasta nao encontrada no GitHub: ' + pasta);
        }
    };
}

app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const { data, error } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
        if (error) throw error;
        if (data) {
            res.json({ success: true, user: data });
        } else {
            res.status(401).json({ error: 'Usuario nao encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/cadastro', async (req, res) => {
    const { nome, email, telefone } = req.body;
    try {
        const { data, error } = await supabase.from('profiles').insert([{ 
            id: crypto.randomUUID(), 
            name: nome, 
            email: email, 
            phone: telefone 
        }]).select();
        if (error) throw error;
        res.json({ success: true, user: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', servePage('home')); 
app.get('/login', servePage('login_i_love_delicitas_1'));
app.get('/cadastro', servePage('cadastro_i_love_delicitas_1'));

app.get('*', (req, res) => {
    const pasta = req.path.slice(1);
    const caminho = path.join(__dirname, 'pages', pasta, 'code.html');
    if (fs.existsSync(caminho)) {
        res.sendFile(caminho);
    } else {
        res.status(404).send('Pagina nao encontrada');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log('✅ I Love Delicitas ONLINE');
});
