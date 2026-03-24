<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro - I Love Delicitas</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 class="text-2xl font-bold text-red-600 mb-6 text-center">Criar Conta</h1>
        
        <form id="formCadastro" class="space-y-4">
            <input type="text" id="nome" placeholder="Nome Completo" class="w-full p-2 border rounded" required>
            <input type="email" id="email" placeholder="E-mail" class="w-full p-2 border rounded" required>
            <input type="tel" id="telefone" placeholder="Telefone (ex: 31999999999)" class="w-full p-2 border rounded">
            <input type="password" id="senha" placeholder="Crie uma senha" class="w-full p-2 border rounded" required>
            
            <button type="submit" class="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">
                Finalizar Cadastro
            </button>
        </form>
        <p id="mensagem" class="mt-4 text-center text-sm"></p>
    </div>

    <script>
        document.getElementById('formCadastro').addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = document.getElementById('mensagem');
            msg.innerText = "Enviando...";

            const dados = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                senha: document.getElementById('senha').value
            };

            try {
                const resposta = await fetch('/api/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                const resultado = await resposta.json();

                if (resposta.ok) {
                    msg.className = "mt-4 text-center text-green-600";
                    msg.innerText = "Cadastro realizado com sucesso! Redirecionando...";
                    setTimeout(() => window.location.href = '/login', 2000);
                } else {
                    msg.className = "mt-4 text-center text-red-600";
                    msg.innerText = "Erro: " + (resultado.error || "Tente novamente");
                }
            } catch (erro) {
                msg.innerText = "Erro ao conectar com o servidor.";
            }
        });
    </script>
</body>
</html>
