import Image from "next/image";
import Navegacao from '@/Components/navs';
import Navegacao2 from '@/Components/footer';
import Card from '@/Components/Card';


export default function Projetos() {
  return (
    <>
      <Navegacao />

    <Card titulo = "Calculador" descricao= "projeto de uma calculadora"></Card>

    <Card titulo = "projeto tcc" descricao= "tcc next" url="https://github.com/davidcontadecursoeusoprofissio-cybe/cadastro"></Card>

      <Navegacao2 />
    </>
  );
}