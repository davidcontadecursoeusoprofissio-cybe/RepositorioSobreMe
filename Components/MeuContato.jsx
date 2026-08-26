"use client";

import { useEffect, useState } from "react";

export default function MeuContato() {
  const [conversas, setConversas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarConversas();
  }, []);

  async function buscarConversas() {
    try {
      const resposta = await fetch("/api/Contato");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar conversas.");
      }

      const dados = await resposta.json();

      setConversas(dados);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  async function responder(id) {
    if (!mensagem.trim()) return;

    try {
      const resposta = await fetch("/api/Contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contato_id: id,
          mensagem: mensagem.trim(),
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao enviar resposta.");
      }

      setMensagem("");

      buscarConversas();
    } catch (error) {
      console.error(error);
      alert("Não foi possível enviar a resposta.");
    }
  }

  async function apagarParaMim(id) {
    const confirmar = confirm(
      "Apagar esta mensagem somente para você?"
    );

    if (!confirmar) return;

    try {
      await fetch(
        `/api/Contato?id=${id}&tipo=contato_mim`,
        {
          method: "DELETE",
        }
      );

      buscarConversas();
    } catch (error) {
      console.error(error);
    }
  }

  async function apagarResposta(id, tipo) {
    const confirmar = confirm(
      tipo === "resposta_todos"
        ? "Apagar esta resposta para todos?"
        : "Apagar esta resposta somente para você?"
    );

    if (!confirmar) return;

    try {
      await fetch(
        `/api/Contato?id=${id}&tipo=${tipo}`,
        {
          method: "DELETE",
        }
      );

      buscarConversas();
    } catch (error) {
      console.error(error);
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-blue-600">
          Carregando...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">

      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-950">
            Meu Contato
          </h1>

          <p className="mt-2 text-slate-500">
            Suas conversas
          </p>
        </div>

        {conversas.length === 0 && (
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-slate-500">
              Nenhuma conversa encontrada.
            </p>
          </div>
        )}

        <div className="space-y-6">

          {conversas.map((conversa) => (

            <div
              key={conversa.id}
              className="overflow-hidden rounded-lg bg-blue-400 text-white shadow-xl shadow-blue-900/20"
            >

              {/* PESSOA */}

              <div className="border-b border-blue-300/50 p-5">

                <h2 className="text-xl font-bold">
                  {conversa.nome}
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  {conversa.email}
                </p>

              </div>

              <div className="space-y-4 p-5">

                {/* MENSAGEM RECEBIDA */}

                <div className="rounded-lg bg-white p-4 text-slate-900">

                  <p className="text-sm font-bold text-blue-600">
                    Mensagem
                  </p>

                  <p className="mt-2">
                    {conversa.mensagem}
                  </p>

                  <button
                    onClick={() =>
                      apagarParaMim(conversa.id)
                    }
                    className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
                  >
                    Apagar para mim
                  </button>

                </div>

                {/* RESPOSTAS */}

                {conversa.respostas?.map((resposta) => (

                  <div
                    key={resposta.id}
                    className="ml-4 rounded-lg bg-blue-500 p-4 sm:ml-12"
                  >

                    <p className="text-sm font-bold text-blue-100">
                      Você
                    </p>

                    <p className="mt-2">
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
                        className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
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
                        className="rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white hover:bg-red-600"
                      >
                        Apagar para todos
                      </button>

                    </div>

                  </div>

                ))}

                {/* RESPONDER */}

                <div className="rounded-lg bg-blue-300/40 p-4">

                  <textarea
                    value={mensagem}
                    onChange={(event) =>
                      setMensagem(event.target.value)
                    }
                    placeholder="Digite sua resposta..."
                    rows={3}
                    className="w-full resize-none rounded-lg border-2 border-blue-700 bg-white p-3 text-slate-900 outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200"
                  />

                  <button
                    onClick={() =>
                      responder(conversa.id)
                    }
                    className="mt-3 rounded-lg border-2 border-green-700 bg-green-400 px-5 py-2 font-bold text-white hover:bg-green-500"
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