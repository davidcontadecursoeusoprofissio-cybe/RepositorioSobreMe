export default function Nav() {
  return (
    <nav className="  bg-blue-500 h-15 text-white">
        <h1 className="mt-4 ms-10 text-2xl">DAVID ALARCON CAMISÃO</h1>       
      <ul  className="flex gap-10 -mt-7 ms-285">
        <li className=""><a href="http://localhost:3000/">INICIO</a></li>
        <li><a href="http://localhost:3000/Projetos">PROJETO</a></li>
        <li><a href="http://localhost:3000/Contato">CONTATO</a></li>
      </ul>
    </nav>
  );
}