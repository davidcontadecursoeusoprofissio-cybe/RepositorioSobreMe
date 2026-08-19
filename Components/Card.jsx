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

  function abrirGit(projeto) {
    const link =
      projeto.urlGit ||
      projeto.gitHub ||
      projeto.github ||
      projeto.githubUrl ||
      projeto.url;

    if (!link) {
      alert("O projeto não possui um link do GitHub cadastrado.");
      return;
    }

    const url = link.startsWith("http")
      ? link
      : `https://${link}`;

    window.open(url, "_blank");
  }

  // FUNÇÃO PARA REMOVER
  async function removerProjeto(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja remover este projeto?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(`/api/Projeto?id=${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao remover o projeto.");
      }

      // Remove da tela depois de remover do banco
      setProjetos((projetosAtuais) =>
        projetosAtuais.filter((projeto) => projeto.id !== id)
      );

    } catch (error) {
      console.error("Erro ao remover projeto:", error);
      alert("Erro ao remover o projeto.");
    }
  }

  if (carregando) {
    return <p className="p-6 text-blue-700">Carregando projetos...</p>;
  }

  if (erro) {
    return <p className="p-6 text-red-600">{erro}</p>;
  }

  if (projetos.length === 0) {
    return (
      <p className="p-6 text-slate-500">
        Nenhum projeto cadastrado.
      </p>
    );
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
            <h2 className="text-xl font-bold">
              {projeto.titulo}
            </h2>

            <p className="mt-3 text-sm leading-6 text-blue-50">
              {projeto.descricao}
            </p>

            <div>
              <button
                type="button"
                onClick={() => abrirGit(projeto)}
                className="mt-4 rounded bg-white px-4 py-2 text-blue-600 transition hover:bg-blue-100"
              >
                Clique aqui para ir para o Git
              </button>

              <button
                type="button"
                onClick={() => removerProjeto(projeto.id)}
                className="mt-4 ml-2 rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                Remover
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

