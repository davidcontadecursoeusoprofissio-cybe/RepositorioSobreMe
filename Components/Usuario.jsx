"use client";

import { useEffect, useState } from "react";

export default function Usuario() {
  const [conversas, setConversas] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [mensagensApagadas, setMensagensApagadas] = useState([]);
  const [respostasApagadas, setRespostasApagadas] = useState([]);

  useEffect(() => {
    const mensagensSalvas = JSON.parse(
      localStorage.getItem("usuario_mensagens_apagadas") || "[]"
    );

    const respostasSalvas = JSON.parse(
      localStorage.getItem("usuario_respostas_apagadas") || "[]"
    );

    setMensagensApagadas(mensagensSalvas);
    setRespostasApagadas(respostasSalvas);

    buscarMensagens();
  }, []);

  async function buscarMensagens() {
    try {
      const response = await fetch("/api/Contato");

      if (!response.ok) {
        throw new Error("Erro ao buscar mensagens.");
      }

      const dados = await response.json();

      setConversas(dados);
    } catch (error) {
      console.error(error);
    }
  }

  // MENSAGEM DO CONTATO -> APAGAR SOMENTE PARA VOCÊ
  function apagarMensagemParaMim(id) {
    const novoId = Number(id);

    const novas = [...mensagensApagadas, novoId];

    setMensagensApagadas(novas);

    localStorage.setItem(
      "usuario_mensagens_apagadas",
      JSON.stringify(novas)
    );
  }

  // SUA RESPOSTA -> APAGAR SOMENTE PARA VOCÊ
  function apagarRespostaParaMim(id) {
    const novoId = Number(id);

    const novas = [...respostasApagadas, novoId];

    setRespostasApagadas(novas);

    localStorage.setItem(
      "usuario_respostas_apagadas",
      JSON.stringify(novas)
    );
  }

  // SUA RESPOSTA -> APAGAR PARA TODOS
  async function apagarRespostaParaTodos(id) {
    const confirmar = window.confirm(
      "Apagar sua mensagem para todos?"
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `/api/Contato?id=${id}&tipo=todos`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao apagar.");
      }

      setConversas((lista) =>
        lista.map((conversa) => ({
          ...conversa,
          respostas: (conversa.respostas || []).filter(
            (resposta) =>
              Number(resposta.id) !== Number(id)
          ),
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Não foi possível apagar para todos.");
    }
  }

  // RESPONDER
  async function responder(id) {
    const texto = respostas[id]?.trim();

    if (!texto) return;

    try {
      const response = await fetch("/api/Contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contato_id: id,
          mensagem: texto,
          remetente: "admin",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao responder.");
      }

      setRespostas((atual) => ({
        ...atual,
        [id]: "",
      }));

      buscarMensagens();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8">

      <div className="mx-auto max-w-3xl">

        <h1 className="mb-8 text-center text-4xl font-black text-blue-600">
          Usuário
        </h1>

        <div className="space-y-6">

          {conversas.map((contato) => (

            <div
              key={contato.id}
              className="rounded-lg bg-blue-400 p-5 shadow-xl"
            >

              {/* MENSAGEM ORIGINAL */}

              {!mensagensApagadas.includes(
                Number(contato.id)
              ) && (
                <div className="rounded-lg bg-slate-200 p-4 text-slate-900">

                  <p>{contato.mensagem}</p>

                  <button
                    type="button"
                    onClick={() =>
                      apagarMensagemParaMim(
                        contato.id
                      )
                    }
                    className="mt-3 rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                  >
                    Apagar para mim
                  </button>

                </div>
              )}

              {/* TODAS AS MENSAGENS DA CONVERSA */}

              <div className="mt-4 space-y-3">

                {(contato.respostas || []).map(
                  (resposta) => {

                    const id = Number(resposta.id);

                    // MENSAGEM SUA
                    if (resposta.remetente === "admin") {

                      if (respostasApagadas.includes(id)) {
                        return null;
                      }

                      return (
                        <div
                          key={resposta.id}
                          className="ml-8 rounded-lg bg-green-400 p-4 text-green-950"
                        >

                          <p>{resposta.mensagem}</p>

                          <div className="mt-3 flex flex-wrap gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                apagarRespostaParaMim(
                                  resposta.id
                                )
                              }
                              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
                            >
                              Apagar para mim
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                apagarRespostaParaTodos(
                                  resposta.id
                                )
                              }
                              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
                            >
                              Apagar para todos
                            </button>

                          </div>

                        </div>
                      );
                    }

                    // MENSAGEM ENVIADA PELO MEU CONTATO
                    if (resposta.remetente === "usuario") {

                      if (mensagensApagadas.includes(id)) {
                        return null;
                      }

                      return (
                        <div
                          key={resposta.id}
                          className="ml-8 rounded-lg bg-slate-200 p-4 text-slate-900"
                        >

                          <p>{resposta.mensagem}</p>

                          <button
                            type="button"
                            onClick={() =>
                              apagarMensagemParaMim(
                                resposta.id
                              )
                            }
                            className="mt-3 rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                          >
                            Apagar para mim
                          </button>

                        </div>
                      );
                    }

                    return null;
                  }
                )}

              </div>

              {/* RESPONDER */}

              <textarea
                value={respostas[contato.id] || ""}
                onChange={(event) =>
                  setRespostas((atual) => ({
                    ...atual,
                    [contato.id]:
                      event.target.value,
                  }))
                }
                placeholder="Digite sua resposta..."
                rows={4}
                className="mt-5 w-full resize-none rounded-lg border-2 border-blue-700 bg-white p-3 text-slate-900 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  responder(contato.id)
                }
                className="mt-3 rounded-lg bg-green-400 px-6 py-3 font-bold text-white hover:bg-green-500"
              >
                Responder
              </button>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}