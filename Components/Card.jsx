"use client";

import { useEffect, useState } from "react";

export default function Card() {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarProjetos() {
      try {
        const resposta = await fetch("/api/Projeto");

        if (!resposta.ok) {
          throw new Error(`Erro ${resposta.status} ao buscar os projetos.`);
        }

        const dadosDoBanco = await resposta.json();
        setProjetos(dadosDoBanco);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        setErro(error.message || "Não foi possível carregar os projetos.");
      } finally {
        setCarregando(false);
      }
    }

    buscarProjetos();
  }, []);

  if (carregando) {
    return <p className="p-6 text-blue-700">Carregando projetos...</p>;
  }

  if (erro) {
    return <p className="p-6 text-red-600">{erro}</p>;
  }

  if (projetos.length === 0) {
    return <p className="p-6 text-slate-500">Nenhum projeto cadastrado.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {projetos.map((projeto) => (
        <li
          key={projeto.id}
          className="overflow-hidden rounded-lg bg-blue-400 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          {projeto.img && (
            <img
              src={projeto.img}
              alt={`Imagem do projeto ${projeto.titulo}`}
              className="h-40 w-full object-cover"
            />
          )}

          <div className="p-5">
            <h2 className="text-xl font-bold">{projeto.titulo}</h2>
            <p className="mt-3 text-sm leading-6 text-blue-50">
              {projeto.descricao}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
