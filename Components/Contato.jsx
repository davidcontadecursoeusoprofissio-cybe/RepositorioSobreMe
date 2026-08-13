"use client";

import { useState } from "react";

const API_URL = "/api/contato";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

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
      <section
        aria-labelledby="contact-title"
        className="mx-auto w-full max-w-3xl rounded-lg bg-blue-400 px-5 py-8 text-white shadow-xl shadow-blue-900/20 sm:px-10 sm:py-10"
      >
        <div className="mx-auto max-w-2xl">
          <h1
            id="contact-title"
            className="mb-8 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Entre em Contato
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nome" className="sr-only">Seu nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu Nome"
                autoComplete="name"
                required
                className="w-full rounded-lg border-2 border-blue-700 bg-blue-50 px-3 py-3 text-base text-blue-950 outline-none transition placeholder:text-blue-700 focus:border-blue-900 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Seu e-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Seu Email"
                autoComplete="email"
                required
                className="w-full rounded-lg border-2 border-blue-700 bg-blue-50 px-3 py-3 text-base text-blue-950 outline-none transition placeholder:text-blue-700 focus:border-blue-900 focus:ring-4 focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="mensagem" className="sr-only">Mensagem</label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                placeholder="Mensagem"
                rows={6}
                required
                className="w-full resize-y border-2 border-sky-700 bg-white px-3 py-3 text-base text-slate-900 outline-none transition placeholder:text-sky-700/80 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200"
              />
            </div>

            {feedback.message && (
              <p
                role="alert"
                className={
                  feedback.type === "success"
                    ? "text-center text-sm font-medium text-green-700"
                    : "text-center text-sm font-medium text-red-700"
                }
              >
                {feedback.message}
              </p>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 rounded-lg border-2 border-green-700 bg-green-400 px-7 text-base font-bold text-white transition hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>

              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-12 w-12 -rotate-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 23 43 6 29 42l-7-15L5 23Z" />
                <path d="m22 27 21-21" />
                <path d="m22 27 1 13" />
              </svg>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}