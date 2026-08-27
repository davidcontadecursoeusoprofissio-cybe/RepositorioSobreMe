"use client";

import { useEffect, useState } from "react";

export default function Usuario() {

  const [conversas, setConversas] = useState([]);

  const [mensagens, setMensagens] = useState({});

  const [apagadas, setApagadas] = useState([]);


  // ==========================================
  // INICIAR
  // ==========================================

  useEffect(() => {
    buscarMensagens();
    buscarApagadas();
  }, []);


  // ==========================================
  // BUSCAR CONVERSA
  // ==========================================

  async function buscarMensagens() {

    try {

      const response = await fetch(
        "/api/Contato"
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao buscar mensagens."
        );
      }

      const dados = await response.json();

      setConversas(dados);

    } catch (error) {

      console.error(error);

    }

  }


  // ==========================================
  // BUSCAR O QUE O USUARIO APAGOU PARA ELE
  // ==========================================

  async function buscarApagadas() {

    try {

      const response = await fetch(
        "/api/MeuContatoUsuario"
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao buscar apagadas."
        );
      }

      const dados = await response.json();

      setApagadas(dados);

    } catch (error) {

      console.error(error);

    }

  }


  // ==========================================
  // VERIFICAR SE A MENSAGEM ESTÁ APAGADA
  // ==========================================

  function estaApagada(
    mensagemId,
    tipo
  ) {

    return apagadas.some(
      (item) =>
        Number(item.mensagem_id) ===
          Number(mensagemId) &&
        item.tipo === tipo
    );

  }


  // ==========================================
  // APAGAR PARA MIM
  // ==========================================

  async function apagarParaMim(
    contatoId,
    mensagemId,
    tipo
  ) {

    try {

      const response = await fetch(
        "/api/MeuContatoUsuario",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            contato_id:
              Number(contatoId),

            mensagem_id:
              Number(mensagemId),

            tipo: tipo

          })
        }
      );


      if (!response.ok) {

        throw new Error(
          "Erro ao apagar para mim."
        );

      }


      setApagadas((atual) => [

        ...atual,

        {
          contato_id:
            Number(contatoId),

          mensagem_id:
            Number(mensagemId),

          tipo: tipo
        }

      ]);


    } catch (error) {

      console.error(error);

      alert(
        "Não foi possível apagar para mim."
      );

    }

  }


  // ==========================================
  // APAGAR PARA TODOS
  //
  // SOMENTE MENSAGEM DO USUARIO
  // ==========================================

  async function apagarParaTodos(id) {

    const confirmar =
      window.confirm(
        "Apagar sua mensagem para todos?"
      );


    if (!confirmar) {
      return;
    }


    try {

      const response = await fetch(

        `/api/Contato?id=${id}&tipo=todos&remetente=usuario`,

        {
          method: "DELETE"
        }

      );


      if (!response.ok) {

        throw new Error(
          "Erro ao apagar para todos."
        );

      }


      // REMOVE DA TELA
      setConversas((lista) =>

        lista.map((contato) => ({

          ...contato,

          respostas:
            (contato.respostas || [])
              .filter(
                (resposta) =>
                  Number(resposta.id) !==
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


  // ==========================================
  // ENVIAR MENSAGEM
  // ==========================================

  async function enviarMensagem(
    contatoId
  ) {

    const texto =
      mensagens[contatoId]?.trim();


    if (!texto) {
      return;
    }


    try {

      const response = await fetch(
        "/api/Contato",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            contato_id:
              contatoId,

            mensagem:
              texto,

            remetente:
              "usuario"

          })

        }
      );


      if (!response.ok) {

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

          Usuário

        </h1>


        <div className="space-y-6">


          {conversas.map((contato) => (

            <div
              key={contato.id}
              className="rounded-lg bg-blue-400 p-5 shadow-xl"
            >


              {/* =================================
                  MENSAGEM INICIAL
                  MEU CONTATO
              ================================= */}

              {!estaApagada(
                contato.id,
                "contato"
              ) && (

                <div className="rounded-lg bg-slate-200 p-4 text-slate-900">

                  <p className="break-words">

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
                    className="mt-3 rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                  >

                    Apagar para mim

                  </button>

                </div>

              )}


              {/* =================================
                  HISTÓRICO
              ================================= */}

              <div className="mt-4 space-y-3">


                {(contato.respostas || []).map(
                  (resposta) => {

                    const id =
                      Number(resposta.id);


                    // =================================
                    // MEU CONTATO
                    // SOMENTE APAGAR PARA MIM
                    // =================================

                    if (
                      resposta.remetente ===
                      "admin"
                    ) {


                      if (
                        estaApagada(
                          id,
                          "admin"
                        )
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


                            <button
                              type="button"
                              onClick={() =>
                                apagarParaMim(
                                  contato.id,
                                  id,
                                  "admin"
                                )
                              }
                              className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
                            >

                              Apagar para mim

                            </button>

                          </div>

                        </div>

                      );

                    }


                    // =================================
                    // USUARIO
                    // APAGAR PARA MIM + TODOS
                    // =================================

                    if (
                      resposta.remetente ===
                      "usuario"
                    ) {


                      if (
                        estaApagada(
                          id,
                          "usuario"
                        )
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


                            <div className="mt-3 flex flex-wrap gap-2">


                              {/* APAGAR PARA MIM */}

                              <button
                                type="button"
                                onClick={() =>
                                  apagarParaMim(
                                    contato.id,
                                    id,
                                    "usuario"
                                  )
                                }
                                className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
                              >

                                Apagar para mim

                              </button>


                              {/* APAGAR PARA TODOS */}

                              <button
                                type="button"
                                onClick={() =>
                                  apagarParaTodos(
                                    id
                                  )
                                }
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
                              >

                                Apagar para todos

                              </button>


                            </div>

                          </div>

                        </div>

                      );

                    }


                    return null;

                  }
                )}

              </div>


              {/* =================================
                  NOVA MENSAGEM
              ================================= */}

              <textarea
                value={
                  mensagens[contato.id] ||
                  ""
                }
                onChange={(event) =>
                  setMensagens((atual) => ({

                    ...atual,

                    [contato.id]:
                      event.target.value

                  }))
                }
                placeholder="Digite sua mensagem..."
                rows={4}
                className="mt-5 w-full resize-none rounded-lg border-2 border-blue-700 bg-white p-3 text-slate-900 outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200"
              />


              <button
                type="button"
                onClick={() =>
                  enviarMensagem(
                    contato.id
                  )
                }
                className="mt-3 rounded-lg bg-green-400 px-6 py-3 font-bold text-white hover:bg-green-500"
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