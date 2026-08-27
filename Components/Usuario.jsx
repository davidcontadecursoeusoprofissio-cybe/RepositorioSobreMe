"use client";

import { useEffect, useState } from "react";

export default function Usuario() {
  const [conversas, setConversas] = useState([]);
  const [mensagens, setMensagens] = useState({});
  const [apagadas, setApagadas] = useState([]);

  useEffect(() => {
    buscarMensagens();
    buscarApagadas();
  }, []);

  async function buscarMensagens() {
    try {
      const response = await fetch("/api/Contato");

      if (!response.ok) {
        throw new Error("Erro ao buscar.");
      }

      const dados = await response.json();

      setConversas(dados);
    } catch (error) {
      console.error(error);
    }
  }

  async function buscarApagadas() {
    try {
      const response = await fetch(
        "/api/MeuContatoUsuario"
      );

      const dados = await response.json();

      setApagadas(dados);

    } catch (error) {
      console.error(error);
    }
  }

  function foiApagada(id, tipo) {
    return apagadas.some(
      (item) =>
        Number(item.mensagem_id) === Number(id) &&
        item.tipo === tipo
    );
  }

  // APAGAR PARA MIM
  async function apagarParaMim(
    mensagemId,
    contatoId,
    tipo
  ) {
    try {
      const response = await fetch(
        "/api/MeuContatoUsuario",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            mensagem_id: Number(mensagemId),
            contato_id: Number(contatoId),
            tipo: tipo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao apagar.");
      }

      setApagadas((atual) => [
        ...atual,
        {
          mensagem_id: Number(mensagemId),
          contato_id: Number(contatoId),
          tipo: tipo,
        },
      ]);

    } catch (error) {
      console.error(error);
    }
  }

  // APAGAR PARA TODOS
  // SOMENTE MENSAGEM DO USUARIO
  async function apagarParaTodos(id) {
    const confirmar = window.confirm(
      "Apagar sua mensagem para todos?"
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `/api/Contato?id=${id}&tipo=todos&remetente=usuario`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao apagar.");
      }

      setConversas((lista) =>
        lista.map((contato) => ({
          ...contato,

          respostas:
            (contato.respostas || []).filter(
              (resposta) =>
                Number(resposta.id) !==
                Number(id)
            ),
        }))
      );

    } catch (error) {
      console.error(error);
      alert("Erro ao apagar para todos.");
    }
  }

  // ENVIAR
  async function enviarMensagem(contatoId) {
    const texto =
      mensagens[contatoId]?.trim();

    if (!texto) return;

    try {
      const response = await fetch(
        "/api/Contato",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            contato_id: contatoId,
            mensagem: texto,
            remetente: "usuario",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar.");
      }

      setMensagens((atual) => ({
        ...atual,
        [contatoId]: "",
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

              {/* MENSAGEM INICIAL */}

              {!foiApagada(
                contato.id,
                "contato"
              ) && (

                <div className="rounded-lg bg-slate-200 p-4 text-slate-900">

                  <p>
                    {contato.mensagem}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      apagarParaMim(
                        contato.id,
                        contato.id,
                        "contato"
                      )
                    }
                    className="mt-3 rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
                  >
                    Apagar para mim
                  </button>

                </div>
              )}

              {/* RESPOSTAS */}

              <div className="mt-4 space-y-3">

                {(contato.respostas || []).map(
                  (resposta) => {

                    const id =
                      Number(resposta.id);

                    {/* MEU CONTATO */}

                    if (
                      resposta.remetente ===
                      "admin"
                    ) {

                      if (
                        foiApagada(
                          id,
                          "admin"
                        )
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={resposta.id}
                          className="ml-8 rounded-lg bg-green-400 p-4 text-green-950"
                        >

                          <p>
                            {resposta.mensagem}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              apagarParaMim(
                                id,
                                contato.id,
                                "admin"
                              )
                            }
                            className="mt-3 rounded-lg bg-white px-4 py-2 font-bold text-blue-600"
                          >
                            Apagar para mim
                          </button>

                        </div>
                      );
                    }

                    {/* USUARIO */}

                    if (
                      resposta.remetente ===
                      "usuario"
                    ) {

                      if (
                        foiApagada(
                          id,
                          "usuario"
                        )
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={resposta.id}
                          className="ml-8 rounded-lg bg-slate-200 p-4 text-slate-900"
                        >

                          <p>
                            {resposta.mensagem}
                          </p>

                          <div className="mt-3 flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                apagarParaMim(
                                  id,
                                  contato.id,
                                  "usuario"
                                )
                              }
                              className="rounded-lg bg-white px-4 py-2 font-bold text-blue-600"
                            >
                              Apagar para mim
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                apagarParaTodos(id)
                              }
                              className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
                            >
                              Apagar para todos
                            </button>

                          </div>

                        </div>
                      );
                    }

                    return null;
                  }
                )}

              </div>

              {/* NOVA MENSAGEM */}

              <textarea
                value={
                  mensagens[contato.id] || ""
                }
                onChange={(event) =>
                  setMensagens((atual) => ({
                    ...atual,
                    [contato.id]:
                      event.target.value,
                  }))
                }
                placeholder="Digite sua mensagem..."
                rows={4}
                className="mt-5 w-full resize-none rounded-lg border-2 border-blue-700 bg-white p-3 text-slate-900 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  enviarMensagem(
                    contato.id
                  )
                }
                className="mt-3 rounded-lg bg-green-400 px-6 py-3 font-bold text-white"
              >
                Enviar mensagem
              </button>

            </div>
          ))}

        </div>
      </div>

    </main>
  );
}