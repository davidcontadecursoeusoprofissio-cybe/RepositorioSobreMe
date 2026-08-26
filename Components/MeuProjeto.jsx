"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarProjetos() {
      try {
        const resposta = await fetch("/api/Projeto");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar os projetos.");
        }

        const dados = await resposta.json();

        setProjetos(dados);
      } catch (error) {
        console.error(error);
        setErro(error.message);
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

  async function apagarProjeto(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja apagar este projeto?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(`/api/Projeto?id=${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao apagar o projeto.");
      }

      setProjetos((lista) =>
        lista.filter((projeto) => projeto.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-blue-700">
          Carregando projetos...
        </p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-red-600">
          {erro}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">

      <div className="mx-auto max-w-6xl">

        {/* TÍTULO */}

        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
          Projetos
        </p>

        <h1 className="text-4xl font-black text-slate-950">
          Meus Projetos
        </h1>

        <p className="mt-3 text-slate-500">
          Veja e gerencie os projetos cadastrados.
        </p>

        {/* PROJETOS */}

        {projetos.length === 0 ? (

          <p className="mt-8 text-slate-500">
            Nenhum projeto cadastrado.
          </p>

        ) : (

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {projetos.map((projeto) => (

              <div
                key={projeto.id}
                className="overflow-hidden rounded-lg bg-blue-400 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >

                {/* IMAGEM */}

                {projeto.img ? (
                  <img
                    src={projeto.img}
                    alt={`Imagem do projeto ${projeto.titulo}`}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-blue-300">
                    <p className="font-semibold">
                      Sem imagem
                    </p>
                  </div>
                )}

                {/* CONTEÚDO */}

                <div className="p-5">

                  <h2 className="text-xl font-bold">
                    {projeto.titulo}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-blue-50">
                    {projeto.descricao}
                  </p>

                  {/* BOTÕES */}

                  <div className="mt-5 flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() => abrirGit(projeto)}
                      className="rounded bg-white px-4 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                    >
                      Ver GitHub
                    </button>

                    <button
                      type="button"
                      onClick={() => apagarProjeto(projeto.id)}
                      className="rounded bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                    >
                      Apagar
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}