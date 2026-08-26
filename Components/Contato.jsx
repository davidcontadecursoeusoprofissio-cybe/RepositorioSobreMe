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

    setFormData((atual) => ({
      ...atual,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const resposta = await fetch("/api/Contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          mensagem: formData.mensagem.trim(),
        }),
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível enviar.");
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
      console.error(error);

      setFeedback({
        type: "error",
        message: "Erro ao enviar mensagem.",
      });

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8">

      <section className="mx-auto max-w-3xl rounded-lg bg-blue-400 p-6 text-white shadow-xl">

        <div className="mb-6 flex justify-end">

          <a
            href="/Usuario"
            className="rounded-lg bg-white px-5 py-2 font-bold text-blue-600 hover:bg-blue-100"
          >
            Usuário
          </a>

        </div>

        <h1 className="mb-8 text-center text-4xl font-black">
          Entre em Contato
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Seu Nome"
            required
            className="w-full rounded-lg border-2 border-blue-700 bg-blue-50 p-3 text-blue-950"
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Seu Email"
            required
            className="w-full rounded-lg border-2 border-blue-700 bg-blue-50 p-3 text-blue-950"
          />

          <textarea
            name="mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            placeholder="Mensagem"
            rows={6}
            required
            className="w-full rounded-lg border-2 border-blue-700 bg-white p-3 text-slate-900"
          />

          {feedback.message && (
            <p className="text-center font-bold">
              {feedback.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg border-2 border-green-700 bg-green-400 px-7 py-3 font-bold text-white hover:bg-green-500"
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>

        </form>

      </section>

    </main>
  );
}