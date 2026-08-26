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
      mensagem TEXT NOT NULL,
      remetente TEXT NOT NULL
    )
  `);

  return db;
}


// BUSCAR

export async function GET() {
  try {
    const db = await abrirBanco();

    const contatos = await db.all(`
      SELECT * FROM contato
      ORDER BY id ASC
    `);

    for (const contato of contatos) {
      contato.respostas = await db.all(
        `
        SELECT * FROM respostas
        WHERE contato_id = ?
        ORDER BY id ASC
        `,
        [contato.id]
      );
    }

    return NextResponse.json(contatos);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { erro: "Erro ao buscar mensagens." },
      { status: 500 }
    );
  }
}


// ENVIAR

export async function POST(request) {
  try {
    const dados = await request.json();

    const db = await abrirBanco();

    // PRIMEIRA MENSAGEM
    if (!dados.contato_id) {
      const { mensagem, nome, email } = dados;

      const resultado = await db.run(
        `
        INSERT INTO contato
        (mensagem, nome, email)
        VALUES (?, ?, ?)
        `,
        [
          mensagem,
          nome,
          email,
        ]
      );

      return NextResponse.json(
        {
          id: resultado.lastID,
          mensagem: "Mensagem enviada.",
        },
        { status: 201 }
      );
    }


    // RESPOSTA

    await db.run(
      `
      INSERT INTO respostas
      (contato_id, mensagem, remetente)
      VALUES (?, ?, ?)
      `,
      [
        dados.contato_id,
        dados.mensagem,
        dados.remetente,
      ]
    );

    return NextResponse.json(
      {
        mensagem: "Mensagem enviada.",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { erro: "Erro ao enviar." },
      { status: 500 }
    );
  }
}


// APAGAR

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const tipo = searchParams.get("tipo");

    const db = await abrirBanco();


    // APAGAR MENSAGEM DO USUÁRIO

    if (tipo === "usuario") {

      await db.run(
        `
        DELETE FROM respostas
        WHERE contato_id = ?
        `,
        [id]
      );

      await db.run(
        `
        DELETE FROM contato
        WHERE id = ?
        `,
        [id]
      );
    }


    // APAGAR SUA MENSAGEM

    if (tipo === "todos") {

      await db.run(
        `
        DELETE FROM respostas
        WHERE id = ?
        AND remetente = 'admin'
        `,
        [id]
      );
    }


    return NextResponse.json({
      mensagem: "Mensagem apagada.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { erro: "Erro ao apagar." },
      { status: 500 }
    );
  }
}