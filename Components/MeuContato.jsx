"use client";

import { useEffect, useState } from "react";

export default function MeuContato() {
  const [conversas, setConversas] = useState([]);
  const [mensagens, setMensagens] = useState({});
  const [apagadas, setApagadas] = useState([]);

  useEffect(() => {
    buscarMensagens();
    buscarApagadas();
  }, []);

  // BUSCAR CONVERSAS
  async function buscarMensagens() {
    try {
      const resposta = await fetch("/api/Contato");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar mensagens.");
      }

      const dados = await resposta.json();

      setConversas(dados);

    } catch (error) {
      console.error(error);
    }
  }

  // BUSCAR O QUE O MEU CONTATO APAGOU PARA ELE
  async function buscarApagadas() {
    try {
      const resposta = await fetch(
        "/api/MeuContatoUsuario"
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar apagadas.");
      }

      const dados = await resposta.json();

      setApagadas(
        dados.map(
          (item) => Number(item.mensagem_id)
        )
      );

    } catch (error) {
      console.error(error);
    }
  }

  // APAGAR PARA MIM
  async function apagarParaMim(
    mensagemId,
    contatoId
  ) {
    const id = Number(mensagemId);

    try {
      const resposta = await fetch(
        "/api/MeuContatoUsuario",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            contato_id:
              Number(contatoId),

            mensagem_id: id,

            tipo: "mensagem"
          })
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao apagar.");
      }

      setApagadas((atual) => [
        ...atual,
        id
      ]);

    } catch (error) {
      console.error(error);
      alert("Não foi possível apagar.");
    }
  }

  // APAGAR PARA TODOS
  async function apagarParaTodos(id) {
    const confirmar = window.confirm(
      "Apagar sua mensagem para todos?"
    );

    if (!confirmar) return;

    try {
      const resposta = await fetch(
        `/api/Contato?id=${id}&tipo=todos&remetente=admin`,
        {
          method: "DELETE"
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao apagar.");
      }

      setConversas((lista) =>
        lista.map((conversa) => ({
          ...conversa,

          respostas:
            (conversa.respostas || [])
              .filter(
                (item) =>
                  Number(item.id) !==
                  Number(id)
              )
        }))
      );

    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível apagar para todos."
      );
    }
  }

  // ENVIAR MENSAGEM DO MEU CONTATO
  async function enviarMensagem(contatoId) {
    const texto =
      mensagens[contatoId]?.trim();

    if (!texto) return;

    try {
      const resposta = await fetch(
        "/api/Contato",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            contato_id: contatoId,
            mensagem: texto,
            remetente: "admin"
          })
        }
      );

      if (!resposta.ok) {
        throw new Error(
          "Erro ao enviar mensagem."
        );
      }

      setMensagens((atual) => ({
        ...atual,
        [contatoId]: ""
      }));

      buscarMensagens();

    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível enviar a mensagem."
      );
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

            {conversas.map((contato) => (

              <div
                key={contato.id}
                className="rounded-xl bg-blue-400 p-5 shadow-xl"
              >

                {/* MENSAGEM INICIAL DO USUÁRIO */}

                {!apagadas.includes(
                  Number(contato.id)
                ) && (

                  <div className="flex justify-end">

                    <div className="max-w-[85%] rounded-xl bg-slate-200 p-4 text-slate-900">

                      <p className="break-words">
                        {contato.mensagem}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          apagarParaMim(
                            contato.id,
                            contato.id
                          )
                        }
                        className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white"
                      >
                        Apagar para mim
                      </button>

                    </div>

                  </div>

                )}

                {/* HISTÓRICO */}

                <div className="mt-4 space-y-3">

                  {(contato.respostas || [])
                    .map((resposta) => {

                      const id =
                        Number(
                          resposta.id
                        );

                      // =====================
                      // USUÁRIO
                      // =====================

                      if (
                        resposta.remetente ===
                        "usuario"
                      ) {

                        if (
                          apagadas.includes(id)
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
                                    resposta.id,
                                    contato.id
                                  )
                                }
                                className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white"
                              >
                                Apagar para mim
                              </button>

                            </div>

                          </div>
                        );
                      }

                      // =====================
                      // MEU CONTATO
                      // =====================

                      if (
                        resposta.remetente ===
                        "admin"
                      ) {

                        if (
                          apagadas.includes(id)
                        ) {
                          return null;
                        }

                        return (
                          <div
                            key={resposta.id}
                            className="flex justify-start"
                          >

                            <div className="max-w-[85%] rounded-xl bg-green-400 p-4 text-green-950">

                              <p className="break-words">
                                {resposta.mensagem}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    apagarParaMim(
                                      resposta.id,
                                      contato.id
                                    )
                                  }
                                  className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-600"
                                >
                                  Apagar para mim
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    apagarParaTodos(
                                      resposta.id
                                    )
                                  }
                                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white"
                                >
                                  Apagar para todos
                                </button>

                              </div>

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
                    value={
                      mensagens[
                        contato.id
                      ] || ""
                    }
                    onChange={(event) =>
                      setMensagens(
                        (atual) => ({
                          ...atual,
                          [contato.id]:
                            event.target.value
                        })
                      )
                    }
                    placeholder="Digite sua mensagem..."
                    rows={4}
                    className="w-full resize-none rounded-lg border-2 border-blue-700 bg-white p-3 text-slate-900 outline-none"
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

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}