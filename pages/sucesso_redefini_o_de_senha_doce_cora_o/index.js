import fs from 'fs';
import path from 'path';

export default function Pagina({ conteudo }) {
  return <div dangerouslySetInnerHTML={{ __html: conteudo }} />;
}

export async function getStaticProps() {
  const htmlPath = path.join(process.cwd(), 'pages', path.basename(__dirname), 'code.html');
  let conteudo = '';
  
  try {
    conteudo = fs.readFileSync(htmlPath, 'utf8');
  } catch (e) {
    conteudo = '<h1>Erro ao carregar página</h1>';
  }
  
  return {
    props: { conteudo }
  };
}
