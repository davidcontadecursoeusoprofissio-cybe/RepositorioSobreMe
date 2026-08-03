import Image from "next/image";
import Navegacao from '@/Components/navs';
import Navegacao2 from '@/Components/footer';

export default function Home() {
  return (
    <>
      <Navegacao />
      
      <div className=" flex  bg-blue-400 h-120 w-280 mt-15 ms-50 rounded-lg">
        <img className="h-90 w-90 mt-15 ms-35 rounded-lg" src="imagem/1774527339100.jpg" alt="" />
        <div className="mt-20 ml-10 h-80 w-230 flex flex-col gap-20" >
        <h1 className="text-4xl  ms-11">DESCRIÇÃO SOBRE MIM</h1>
        <p className="-mt-10 ms-1">Olá! Meu nome é David e sou programador. Estudo desenvolvimento de software e tenho conhecimentos em Java, C#, HTML, CSS e JavaScript. Busco evoluir constantemente e criar projetos que fortaleçam minha experiência como desenvolvedor.Aqui você pode acessar meu LinkedIn e GitHub para conhecer meus projetos e acompanhar meu trabalho como desenvolvedor.

</p>

        </div>

      </div>
    
      <Navegacao2 />
    </>
  );
}