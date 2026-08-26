"use client";

import { useState } from "react";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);

    setFeedback({
      type: "",
      message: "",
    });

    const payload = {
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      mensagem: formData.mensagem.trim(),
    };

    try {
      const response = await fetch("/api/Contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Não foi possível enviar a mensagem.");
      }

      setFeedback({
        type: "success",
        message: "Mensagem enviada com sucesso!",
      });

      setFormData({
        nome: "",
        email: "",
        mensagem: "",
      });

    } catch (error) {
      console.error("Erro ao enviar contato:", error);

      setFeedback({
        type: "error",
        message: "Ocorreu um erro ao enviar. Tente novamente.",
      });

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">

      <section className="mx-auto w-full max-w-3xl rounded-lg bg-blue-400 px-5 py-8 text-white shadow-xl shadow-blue-900/20 sm:px-10 sm:py-10">

        {/* BOTÃO USUÁRIO */}

        <div className="mb-6 flex justify-end">
          <a
            href="/Usuario"
            className="rounded-lg bg-white px-5 py-2 font-bold text-blue-600 shadow transition hover:bg-blue-100"
          >
            Usuário
          </a>
        </div>

        <div className="mx-auto max-w-2xl">

          <h1 className="mb-8 text-center text-3xl font-extrabold sm:text-4xl">
            Entre em Contato
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NOME */}

            <input
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu Nome"
              required
              className="w-full rounded-lg border-2 border-blue-700 bg-blue-50 px-3 py-3 text-blue-950 outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200"
            />

            {/* EMAIL */}

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Seu Email"
              required
              className="w-full rounded-lg border-2 border-blue-700 bg-blue-50 px-3 py-3 text-blue-950 outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200"
            />

            {/* MENSAGEM */}

            <textarea
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              placeholder="Mensagem"
              rows={6}
              required
              className="w-full resize-y border-2 border-sky-700 bg-white px-3 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200"
            />

            {/* FEEDBACK */}

            {feedback.message && (
              <p
                className={
                  feedback.type === "success"
                    ? "text-center font-medium text-green-700"
                    : "text-center font-medium text-red-700"
                }
              >
                {feedback.message}
              </p>
            )}

            {/* ENVIAR */}

            <div className="flex items-center justify-center gap-3 pt-2">

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 rounded-lg border-2 border-green-700 bg-green-400 px-7 text-base font-bold text-white transition hover:bg-green-500 disabled:opacity-60"
              >
                {isSubmitting
                  ? "Enviando..."
                  : "Enviar"}
              </button>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
}