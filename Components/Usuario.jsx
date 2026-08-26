"use client";

import { useEffect, useState } from "react";

export default function Usuario() {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [respostas, setRespostas] = useState({});

  useEffect(() => {
    buscarMensagens();
  }, []);

  async function buscarMensagens() {
    try {
      const resposta = await fetch("/api/Contato");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar mensagens.");
      }

      const dados = await resposta.json();

      setMensagens(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  function mudarResposta(id, valor) {
    setRespostas((atual) => ({
      ...atual,
      [id]: valor,
    }));
  }

  async function responder(id) {
    const mensagem = respostas[id]?.trim();

    if (!mensagem) {
      return;
    }

    try {
      const resposta = await fetch("/api/Contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contato_id: id,
          mensagem: mensagem,
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao enviar resposta.");
      }

      setRespostas((atual) => ({
        ...atual,
        [id]: "",
      }));

      buscarMensagens();
    } catch (error) {
      console.error(error);
      alert("Não foi possível enviar a resposta.");
    }
  }

  async function apagarMensagem(id) {
    const confirmar = confirm(
      "Apagar esta mensagem somente para você?"
    );

    if (!confirmar) return;

    await fetch(
      `/api/Contato?id=${id}&tipo=contato_mim`,
      {
        method: "DELETE",
      }
    );

    setMensagens((lista) =>
      lista.filter((mensagem) => mensagem.id !== id)
    );
  }

  async function apagarResposta(id, tipo) {
    const confirmar = confirm(
      tipo === "resposta_todos"
        ? "Apagar esta resposta para todos?"
        : "Apagar esta resposta somente para você?"
    );

    if (!confirmar) return;

    await fetch(
      `/api/Contato?id=${id}&tipo=${tipo}`,
      {
        method: "DELETE",
      }
    );

    buscarMensagens();
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-blue-600">
          Carregando mensagens...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-4xl">

        {/* TÍTULO */}

        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-950">
            Usuário
          </h1>

          <p className="mt-2 text-slate-500">
            Suas mensagens e conversas
          </p>
        </div>

        {/* MENSAGENS */}

        <div className="space-y-6">

          {mensagens.length === 0 && (
            <div className="rounded-lg bg-white p-6 shadow">
              <p className="text-slate-500">
                Nenhuma mensagem recebida.
              </p>
            </div>
          )}

          {mensagens.map((mensagem) => (

            <div
              key={mensagem.id}
              className="overflow-hidden rounded-lg bg-blue-400 text-white shadow-xl shadow-blue-900/20"
            >

              {/* CABEÇALHO */}

              <div className="border-b border-blue-300/50 p-5">

                <h2 className="text-xl font-bold">
                  {mensagem.nome}
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  {mensagem.email}
                </p>

              </div>

              {/* MENSAGEM DA PESSOA */}

              <div className="p-5">

                <div className="rounded-lg bg-white p-4 text-slate-900 shadow-sm">

                  <p className="font-semibold text-blue-600">
                    Mensagem recebida
                  </p>

                  <p className="mt-2 leading-6">
                    {mensagem.mensagem}
                  </p>

                  <button
                    onClick={() =>
                      apagarMensagem(mensagem.id)
                    }
                    className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                  >
                    Apagar para mim
                  </button>

                </div>

                {/* RESPOSTAS */}

                <div className="mt-4 space-y-3">

                  {mensagem.respostas?.map((resposta) => (

                    <div
                      key={resposta.id}
                      className="rounded-lg bg-blue-500 p-4 shadow-sm"
                    >

                      <p className="text-sm font-bold text-blue-100">
                        Você
                      </p>

                      <p className="mt-2 leading-6">
                        {resposta.mensagem}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        <button
                          onClick={() =>
                            apagarResposta(
                              resposta.id,
                              "resposta_mim"
                            )
                          }
                          className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                        >
                          Apagar para mim
                        </button>

                        <button
                          onClick={() =>
                            apagarResposta(
                              resposta.id,
                              "resposta_todos"
                            )
                          }
                          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                        >
                          Apagar para todos
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                {/* RESPONDER */}

                <div className="mt-5 rounded-lg bg-blue-300/40 p-4">

                  <p className="mb-2 text-sm font-bold text-white">
                    Responder mensagem
                  </p>

                  <textarea
                    value={respostas[mensagem.id] || ""}
                    onChange={(event) =>
                      mudarResposta(
                        mensagem.id,
                        event.target.value
                      )
                    }
                    placeholder="Digite sua resposta..."
                    rows={3}
                    className="w-full resize-none rounded-lg border-2 border-blue-700 bg-white p-3 text-slate-900 outline-none transition placeholder:text-blue-400 focus:border-blue-900 focus:ring-4 focus:ring-blue-200"
                  />

                  <button
                    onClick={() =>
                      responder(mensagem.id)
                    }
                    className="mt-3 rounded-lg border-2 border-green-700 bg-green-400 px-5 py-2 font-bold text-white transition hover:bg-green-500"
                  >
                    Responder
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}