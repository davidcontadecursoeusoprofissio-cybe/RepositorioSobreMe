"use client";

import { useEffect, useState } from "react";

const API_URL = "/api/Projeto";

export default function Page() {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarProjetos();
  }, []);

  async function carregarProjetos() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Erro ao buscar projetos.");
      }

      const dados = await response.json();

      setProjetos(dados);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);

      setErro("Não foi possível carregar os projetos.");
    } finally {
      setCarregando(false);
    }
  }

  async function apagarProjeto(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja apagar este projeto?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao apagar projeto.");
      }

      // Remove o projeto da tela depois de apagar
      setProjetos((listaAtual) =>
        listaAtual.filter((projeto) => projeto.id !== id)
      );

    } catch (error) {
      console.error("Erro ao apagar projeto:", error);

      alert("Não foi possível apagar o projeto.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-6xl">

        {/* TÍTULO */}

        <div className="mb-10">

          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
            Projetos
          </p>

          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            Meus Projetos
          </h1>

          <p className="mt-3 text-slate-500">
            Veja os projetos cadastrados no sistema.
          </p>

        </div>

        {/* CARREGANDO */}

        {carregando && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
            <p className="font-semibold text-slate-500">
              Carregando projetos...
            </p>
          </div>
        )}

        {/* ERRO */}

        {!carregando && erro && (
          <div className="rounded-2xl bg-red-100 p-5">
            <p className="font-semibold text-red-700">
              {erro}
            </p>
          </div>
        )}

        {/* NENHUM PROJETO */}

        {!carregando && !erro && projetos.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg">

            <h2 className="text-xl font-bold text-slate-950">
              Nenhum projeto cadastrado
            </h2>

            <p className="mt-2 text-slate-500">
              Os projetos cadastrados aparecerão aqui.
            </p>

          </div>
        )}

        {/* PROJETOS */}

        {!carregando && !erro && projetos.length > 0 && (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {projetos.map((projeto) => (

              <div
                key={projeto.id}
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1"
              >

                {/* IMAGEM */}

                {projeto.img ? (
                  <img
                    src={projeto.img}
                    alt={projeto.titulo}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 w-full items-center justify-center bg-slate-200">
                    <span className="font-semibold text-slate-400">
                      Sem imagem
                    </span>
                  </div>
                )}

                {/* INFORMAÇÕES */}

                <div className="p-5">

                  <h2 className="mb-3 text-2xl font-black text-slate-950">
                    {projeto.titulo}
                  </h2>

                  <p className="mb-5 min-h-[72px] text-sm leading-6 text-slate-500">
                    {projeto.descricao}
                  </p>

                  {/* BOTÕES */}

                  <div className="flex flex-wrap gap-3">

                    {/* GITHUB */}

                    {projeto.urlGit && (
                      <a
                        href={projeto.urlGit}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-600"
                      >
                        Ver GitHub
                      </a>
                    )}

                    {/* APAGAR */}

                    <button
                      type="button"
                      onClick={() => apagarProjeto(projeto.id)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
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