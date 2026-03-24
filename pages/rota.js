import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function RotaDinamica() {
  const router = useRouter();
  const { rota } = router.query;
  
  useEffect(() => {
    if (rota) {
      // Mapeamento de URLs amigáveis para as pastas reais
      const mapeamento = {
        'login': 'login_i_love_delicitas_1',
        'cadastro': 'cadastro_i_love_delicitas_1',
        'carrinho': 'seu_carrinho_i_love_delicitas_1',
        'admin': 'painel_admin_i_love_delicitas_1',
        'checkout': 'checkout_i_love_delicitas',
        'perfil': 'perfil_do_usu_rio_i_love_delicitas',
        'pedidos': 'meus_pedidos_i_love_delicitas_status',
        'enderecos': 'meus_endere_os_i_love_delicitas',
        'acompanhamento': 'acompanhamento_de_pedido_i_love_delicitas',
        'produtos': 'gerenciar_produtos_admin',
        'categorias': 'gerenciar_categorias_admin',
        'cupons': 'gerenciar_cupons_admin_1',
        'clientes': 'lista_de_clientes_admin',
        'configuracoes': 'configura_es_do_app_admin',
        'relatorios': 'relat_rios_de_vendas_admin',
        'esqueci-senha': 'esqueci_minha_senha_i_love_delicitas_1',
        'termos': 'termos_de_uso_i_love_delicitas',
        'privacidade': 'privacy_policy_i_love_delicitas',
        'ajuda': 'ajuda_e_suporte_i_love_delicitas'
      };
      
      const pastaDestino = mapeamento[rota];
      
      if (pastaDestino) {
        window.location.href = `/${pastaDestino}/code.html`;
      } else {
        window.location.href = `/p_gina_inicial_i_love_delicitas_1/code.html`;
      }
    }
  }, [rota]);
  
  return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>;
}
