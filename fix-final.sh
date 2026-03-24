#!/bin/bash
echo "========================================="
echo "CORRECAO FINAL - I LOVE DELICITAS"
echo "========================================="

# 1. Criar next.config.js
echo "[1/4] Criando next.config.js..."
cat > next.config.js << 'NEXT'
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/:path*/', destination: '/:path*/code.html' },
      { source: '/:path*', destination: '/:path*/code.html' }
    ]
  }
}
module.exports = nextConfig
NEXT

# 2. Criar index.js para as pastas principais
echo "[2/4] Criando arquivos de rota..."

for pasta in pages/*/; do
  if [ -f "${pasta}code.html" ]; then
    echo "  -> ${pasta}"
    echo 'import { useEffect } from "react"; export default function Page() { useEffect(() => { window.location.href = "./code.html"; }, []); return <div>Carregando...</div>; }' > "${pasta}index.js"
  fi
done

# 3. Criar rotas amigaveis
echo "[3/4] Criando rotas amigaveis..."

echo 'import { useEffect } from "react"; import { useRouter } from "next/router"; export default function Home() { const router = useRouter(); useEffect(() => { router.push("/p_gina_inicial_i_love_delicitas_1"); }, []); return <div>Redirecionando...</div>; }' > pages/index.js

echo 'import { useEffect } from "react"; import { useRouter } from "next/router"; export default function Login() { const router = useRouter(); useEffect(() => { router.push("/login_i_love_delicitas_1"); }, []); return <div>Redirecionando...</div>; }' > pages/login.js

echo 'import { useEffect } from "react"; import { useRouter } from "next/router"; export default function Cadastro() { const router = useRouter(); useEffect(() => { router.push("/cadastro_i_love_delicitas_1"); }, []); return <div>Redirecionando...</div>; }' > pages/cadastro.js

echo 'import { useEffect } from "react"; import { useRouter } from "next/router"; export default function Carrinho() { const router = useRouter(); useEffect(() => { router.push("/seu_carrinho_i_love_delicitas_1"); }, []); return <div>Redirecionando...</div>; }' > pages/carrinho.js

echo 'import { useEffect } from "react"; import { useRouter } from "next/router"; export default function Admin() { const router = useRouter(); useEffect(() => { router.push("/painel_admin_i_love_delicitas_1"); }, []); return <div>Redirecionando...</div>; }' > pages/admin.js

echo 'import { useEffect } from "react"; import { useRouter } from "next/router"; export default function Checkout() { const router = useRouter(); useEffect(() => { router.push("/checkout_i_love_delicitas"); }, []); return <div>Redirecionando...</div>; }' > pages/checkout.js

# 4. Enviar para o GitHub
echo "[4/4] Enviando para o GitHub..."
git add .
git commit -m "fix: correcao final das rotas"
git push origin main

echo ""
echo "========================================="
echo "PRONTO! Aguarde 2-3 minutos e teste:"
echo "https://i-love-delicitas-final-98rk.vercel.app/"
echo "========================================="
