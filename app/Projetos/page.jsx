import Image from "next/image";
import Navegacao from '@/Components/navs';
import Navegacao2 from '@/Components/footer';
import Card from '@/Components/Card';


export default function Projetos() {
  return (
    <>
      <Navegacao />

    
<div  className="flex flex-wrap">

  {/* <Card titulo = "Projeto Java" descricao= "Um projeto com intuito de cadastra pessoas" url="https://github.com/davidcontadecursoeusoprofissio-cybe/Estudos" img="imagem/Captura de tela 2026-08-03 093429.png"></Card> */}
  {/* <Card titulo = "Projeto Javascript " descricao="um projeto de acesso,com email , senha , if e else" url="https://github.com/davidcontadecursoeusoprofissio-cybe/AtividadeJavascript" img="imagem/Captura de tela 2026-08-04 113055.png"></Card> */}
  {/* <Card titulo = "Projeto " ></Card>
  <Card titulo = "Projeto "  ></Card>
  <Card titulo = "Projeto "  ></Card>
  <Card titulo = "Projeto "  ></Card> */}
  
  <Card></Card>
  
  
    
</div>

      <Navegacao2 />
    </>
  );
}