"use client";

import { useEffect, useState } from "react";

export default function MeuContato() {
  const [conversas, setConversas] = useState([]);
  const [mensagens, setMensagens] = useState({});
  const [apagadas, setApagadas] = useState([]);

  useEffect(() => {
    const salvas = JSON.parse(
      localStorage.getItem("meuContato_apagadas") || "[]"
    );

    setApagadas(salvas);
    buscarMensagens();
  }, []);

  async function buscarMensagens() {
    try {
      const resposta = await fetch("/api/Contato");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar mensagens.");
      }

      const dados = await resposta.json();

      setConversas(dados);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  }

  function apagarParaMim(chave) {
    const confirmar = window.confirm(
      "Apagar esta mensagem somente para você?"
    );

    if (!confirmar) return;

    if (apagadas.includes(chave)) return;

    const novasApagadas = [...apagadas, chave];

    setApagadas(novasApagadas);

    localStorage.setItem(
      "meuContato_apagadas",
      JSON.stringify(novasApagadas)
    );
  }

  async function enviarMensagem(contatoId) {
    const texto = mensagens[contatoId]?.trim();

    if (!texto) return;

    try {
      const resposta = await fetch("/api/Contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contato_id: contatoId,
          mensagem: texto,
          remetente: "usuario",
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao enviar mensagem.");
      }

      setMensagens((atual) => ({
        ...atual,
        [contatoId]: "",
      }));

      buscarMensagens();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Não foi possível enviar a mensagem.");
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8">

      <div className="mx-auto max-w-3xl">

        <h1 className="mb-8 text-center text-4xl font-black text-blue-600">
          Meu Contato
        </h1>

        {conversas.length === 0 ? (
          <p className="text-center text-slate-500">
            Nenhuma conversa encontrada.
          </p>
        ) : (
          <div className="space-y-6">

            {conversas.map((contato) => {

              const chaveInicial = `contato-${contato.id}`;

              return (
                <div
                  key={contato.id}
                  className="rounded-xl bg-blue-400 p-5 shadow-xl"
                >

                  {/* MENSAGEM INICIAL DO USUÁRIO */}

                  <div className="space-y-3">

                    {!apagadas.includes(chaveInicial) && (
                      <div className="flex justify-end">

                        <div className="max-w-[85%] rounded-xl bg-slate-200 p-4 text-slate-900">

                          <p className="break-words">
                            {contato.mensagem}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              apagarParaMim(chaveInicial)
                            }
                            className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
                          >
                            Apagar para mim
                          </button>

                        </div>

                      </div>
                    )}

                    {/* HISTÓRICO */}

                    {(contato.respostas || []).map((resposta) => {

                      const chaveResposta = `resposta-${resposta.id}`;

                      if (
                        resposta.remetente === "usuario"
                      ) {
                        if (
                          apagadas.includes(chaveResposta)
                        ) {
                          return null;
                        }

                        return (
                          <div
                            key={resposta.id}
                            className="flex justify-end"
                          >

                            <div className="max-w-[85%] rounded-xl bg-slate-200 p-4 text-slate-900">

                              <p className="break-words">
                                {resposta.mensagem}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  apagarParaMim(
                                    chaveResposta
                                  )
                                }
                                className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
                              >
                                Apagar para mim
                              </button>

                            </div>

                          </div>
                        );
                      }

                      if (
                        resposta.remetente === "admin"
                      ) {
                        return (
                          <div
                            key={resposta.id}
                            className="flex justify-start"
                          >

                            <div className="max-w-[85%] rounded-xl bg-green-400 p-4 text-green-950">

                              <p className="break-words">
                                {resposta.mensagem}
                              </p>

                            </div>

                          </div>
                        );
                      }

                      return null;
                    })}

                  </div>

                  {/* NOVA MENSAGEM */}

                  <div className="mt-5">

                    <textarea
                      value={mensagens[contato.id] || ""}
                      onChange={(event) =>
                        setMensagens((atual) => ({
                          ...atual,
                          [contato.id]:
                            event.target.value,
                        }))
                      }
                      placeholder="Digite sua mensagem..."
                      rows={4}
                      className="w-full resize-none rounded-lg border-2 border-blue-700 bg-white p-3 text-slate-900 outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        enviarMensagem(contato.id)
                      }
                      className="mt-3 rounded-lg bg-green-400 px-6 py-3 font-bold text-white hover:bg-green-500"
                    >
                      Enviar mensagem
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </main>
  );
}