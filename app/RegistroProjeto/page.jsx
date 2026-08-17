"use client";

import { useEffect, useState } from "react";

const API_URL = "/api/Projeto";

function arquivoParaDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = () =>
      reject(new Error("Não foi possível ler a imagem."));

    leitor.readAsDataURL(arquivo);
  });
}

export default function Page() {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    img: "",
    github: "",
  });

  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState("");
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

  async function handleImagemChange(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      setImagem(null);
      setPreview("");

      setFormData((current) => ({
        ...current,
        img: "",
      }));

      return;
    }

    try {
      const imagemDataUrl = await arquivoParaDataUrl(arquivo);

      setImagem(arquivo);
      setPreview(imagemDataUrl);

      setFormData((current) => ({
        ...current,
        img: imagemDataUrl,
      }));

      setFeedback({
        type: "",
        message: "",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message,
      });
    }
  }

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);

    setFeedback({
      type: "",
      message: "",
    });

    const payload = {
      titulo: formData.titulo.trim(),
      descricao: formData.descricao.trim(),
      img: formData.img || null,
      github: formData.github.trim(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Erro ${response.status} ao cadastrar o projeto.`;

        try {
          const errorData = await response.json();

          if (errorData?.erro) {
            errorMessage = errorData.erro;
          }
        } catch {
          // Mantém a mensagem padrão
        }

        throw new Error(errorMessage);
      }

      setFeedback({
        type: "success",
        message: "Projeto cadastrado com sucesso!",
      });

      setFormData({
        titulo: "",
        descricao: "",
        img: "",
        github: "",
      });

      setImagem(null);
      setPreview("");

      event.target.reset();
    } catch (error) {
      console.error("Erro ao cadastrar projeto:", error);

      setFeedback({
        type: "error",
        message:
          error.message ||
          "Não foi possível cadastrar o projeto.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[720px] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-blue-950/10 lg:grid-cols-[0.85fr_1.15fr]">

        {/* LADO ESQUERDO */}

        <aside className="relative overflow-hidden bg-blue-500 p-7 text-white sm:p-10 lg:p-12">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[32px] border-blue-300/30" />

          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-600/40" />

          <div className="relative flex h-full flex-col justify-between">

            <div>

              <div className="mb-14 flex items-center gap-3">

                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-green-400 text-xl font-black text-blue-950 shadow-lg shadow-blue-950/20">
                  +
                </span>

                <span className="text-lg font-extrabold tracking-tight">
                  ProjectLab
                </span>

              </div>

              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                Identidade do projeto
              </p>

              <h1 className="max-w-sm text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
                Dê uma cara para a sua ideia.
              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-blue-50">
                Escolha uma imagem marcante, conte a história
                e compartilhe o código do seu projeto.
              </p>

            </div>

            <div className="relative mt-12 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">

              <div className="mb-5 flex items-center justify-between">

                <span className="text-xs font-bold uppercase tracking-widest text-blue-100">
                  Progresso
                </span>

                <span className="rounded-full bg-green-400 px-3 py-1 text-xs font-black text-blue-950">
                  01 / 03
                </span>

              </div>

              <div className="space-y-4">

                <div className="flex items-center gap-3">

                  <span className="grid h-8 w-8 place-items-center rounded-full bg-green-400 text-sm font-black text-blue-950">
                    1
                  </span>

                  <span className="text-sm font-bold">
                    Identidade visual
                  </span>

                </div>

                <div className="ml-4 h-5 border-l border-dashed border-blue-200/60" />

                <div className="flex items-center gap-3 opacity-60">

                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/60 text-sm font-bold">
                    2
                  </span>

                  <span className="text-sm font-semibold">
                    Detalhes do projeto
                  </span>

                </div>

                <div className="ml-4 h-5 border-l border-dashed border-blue-200/60" />

                <div className="flex items-center gap-3 opacity-60">

                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/60 text-sm font-bold">
                    3
                  </span>

                  <span className="text-sm font-semibold">
                    Publicação
                  </span>

                </div>

              </div>

            </div>

          </div>

        </aside>

        {/* FORMULÁRIO */}

        <section className="p-7 sm:p-10 lg:p-14">

          <div className="mb-10 flex items-start justify-between gap-5">

            <div>

              <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-500">
                Etapa 01
              </p>

              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Apresente seu projeto
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                Adicione nome, imagem, descrição e o endereço
                do GitHub do projeto.
              </p>

            </div>

            <span className="hidden rounded-2xl bg-green-100 px-3 py-2 text-xs font-bold text-green-700 sm:block">
              Rascunho
            </span>

          </div>

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* NOME */}

            <div className="group">

              <label
                htmlFor="titulo"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Nome do projeto
              </label>

              <input
                id="titulo"
                name="titulo"
                type="text"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ex.: Plataforma Aurora"
                required
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 text-lg font-semibold text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-0"
              />

            </div>

            {/* IMAGEM */}

            <div>

              <div className="mb-2 flex items-center justify-between gap-4">

                <label
                  htmlFor="imagem"
                  className="block text-sm font-bold text-slate-800"
                >
                  Imagem do projeto
                </label>

                <span className="text-xs font-medium text-slate-400">
                  PNG, JPG ou WEBP
                </span>

              </div>

              <label
                htmlFor="imagem"
                className="group relative flex min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 transition hover:border-blue-500 hover:bg-blue-100"
              >

                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Prévia da imagem do projeto"
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-blue-950/80 via-transparent to-transparent p-4">

                      <span className="text-xs font-bold text-white">
                        {imagem?.name}
                      </span>

                    </div>
                  </>
                ) : (
                  <div className="text-center">

                    <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-blue-500 text-2xl font-light text-white shadow-lg shadow-blue-500/20">
                      ↑
                    </span>

                    <p className="text-sm font-bold text-blue-700">
                      Clique para escolher uma imagem
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      A imagem aparecerá aqui como prévia
                    </p>

                  </div>
                )}

                <input
                  id="imagem"
                  name="imagem"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImagemChange}
                  required
                  className="sr-only"
                />

              </label>

            </div>

            {/* DESCRIÇÃO */}

            <div className="group">

              <div className="mb-2 flex items-center justify-between gap-4">

                <label
                  htmlFor="descricao"
                  className="block text-sm font-bold text-slate-800"
                >
                  Descrição do projeto
                </label>

                <span className="text-xs font-medium text-slate-400">
                  Obrigatório
                </span>

              </div>

              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={5}
                placeholder="Qual problema o projeto resolve? Quais são os próximos passos?"
                required
                className="w-full resize-none rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-4 text-base leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* GITHUB */}

            <div className="group">

              <label
                htmlFor="github"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                URL do GitHub
              </label>

              <input
                id="github"
                name="github"
                type="url"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/usuario/projeto"
                required
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 text-lg font-semibold text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-0"
              />

              <p className="mt-2 text-xs text-slate-400">
                Coloque o endereço do repositório desse projeto no GitHub.
              </p>

            </div>

            {/* FEEDBACK */}

            {feedback.message && (

              <p
                role="alert"
                className={
                  feedback.type === "success"
                    ? "rounded-lg bg-green-100 px-4 py-3 text-sm font-semibold text-green-700"
                    : "rounded-lg bg-red-100 px-4 py-3 text-sm font-semibold text-red-700"
                }
              >
                {feedback.message}
              </p>

            )}

            {/* BOTÃO */}

            <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-100 pt-7 sm:flex-row">

              <p className="text-center text-xs leading-5 text-slate-400 sm:max-w-[220px] sm:text-left">
                Você poderá editar estas informações depois.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-3 rounded-xl bg-green-400 px-6 py-3.5 text-sm font-black text-blue-950 shadow-lg shadow-green-400/20 transition hover:-translate-y-0.5 hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Cadastrando..." : "Criar projeto"}

                {!isSubmitting && (
                  <span
                    aria-hidden="true"
                    className="text-lg leading-none"
                  >
                    →
                  </span>
                )}

              </button>

            </div>

          </form>

        </section>

      </div>
    </main>
  );
}