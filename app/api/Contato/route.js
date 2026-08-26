import { NextResponse } from "next/server";

import sqlite3 from "sqlite3";

import { open } from "sqlite";

import path from "path";

async function abrirBanco() {
  const db = await open({
    filename: path.join(process.cwd(), "database.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS contato (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mensagem TEXT NOT NULL,
      nome TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS respostas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contato_id INTEGER NOT NULL,
      mensagem TEXT NOT NULL
    )
  `);

  return db;
}


/* BUSCAR MENSAGENS */

export async function GET() {
  const db = await abrirBanco();

  const contatos = await db.all(
    "SELECT * FROM contato ORDER BY id DESC"
  );

  for (const contato of contatos) {
    contato.respostas = await db.all(
      "SELECT * FROM respostas WHERE contato_id = ? ORDER BY id ASC",
      [contato.id]
    );
  }

  return NextResponse.json(contatos);
}


/* CADASTRAR MENSAGEM OU RESPOSTA */

export async function POST(request) {
  const dados = await request.json();

  const db = await abrirBanco();

  /* RESPOSTA */

  if (dados.contato_id) {
    const { contato_id, mensagem } = dados;

    await db.run(
      `
      INSERT INTO respostas (contato_id, mensagem)
      VALUES (?, ?)
      `,
      [contato_id, mensagem]
    );

    return NextResponse.json(
      { mensagem: "Resposta enviada com sucesso!" },
      { status: 201 }
    );
  }


  /* MENSAGEM DO USUÁRIO */

  const { mensagem, nome, email } = dados;

  const resultado = await db.run(
    `
    INSERT INTO contato (mensagem, nome, email)
    VALUES (?, ?, ?)
    `,
    [mensagem, nome, email]
  );

  return NextResponse.json(
    {
      id: resultado.lastID,
      mensagem: "Mensagem enviada com sucesso!",
    },
    { status: 201 }
  );
}


/* APAGAR */

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");
  const tipo = searchParams.get("tipo");

  const db = await abrirBanco();

  /* APAGAR RESPOSTA PARA TODOS */

  if (tipo === "resposta_todos") {
    await db.run(
      "DELETE FROM respostas WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      mensagem: "Resposta apagada para todos.",
    });
  }


  /* APAGAR RESPOSTA PARA MIM */

  if (tipo === "resposta_mim") {
    /*
      Por enquanto removemos a resposta da visualização.
      Como ainda não existe login/usuário,
      o banco não consegue saber quem apagou.
    */

    await db.run(
      "DELETE FROM respostas WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      mensagem: "Resposta apagada.",
    });
  }


  /* APAGAR MENSAGEM */

  if (tipo === "contato") {
    await db.run(
      "DELETE FROM contato WHERE id = ?",
      [id]
    );

    await db.run(
      "DELETE FROM respostas WHERE contato_id = ?",
      [id]
    );

    return NextResponse.json({
      mensagem: "Mensagem apagada.",
    });
  }


  return NextResponse.json(
    { erro: "Tipo de exclusão inválido." },
    { status: 400 }
  );
}