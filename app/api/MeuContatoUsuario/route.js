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
    CREATE TABLE IF NOT EXISTS meu_contato_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mensagem_id INTEGER NOT NULL,
      contato_id INTEGER NOT NULL,
      tipo TEXT NOT NULL
    )
  `);

  return db;
}

// BUSCAR APAGADAS DO USUARIO
export async function GET() {
  try {
    const db = await abrirBanco();

    const dados = await db.all(`
      SELECT *
      FROM meu_contato_usuario
      ORDER BY id ASC
    `);

    return NextResponse.json(dados);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { erro: "Erro ao buscar." },
      { status: 500 }
    );
  }
}

// USUARIO -> APAGAR PARA MIM
export async function POST(request) {
  try {
    const dados = await request.json();

    const db = await abrirBanco();

    const existe = await db.get(
      `
      SELECT *
      FROM meu_contato_usuario
      WHERE mensagem_id = ?
      AND contato_id = ?
      AND tipo = ?
      `,
      [
        dados.mensagem_id,
        dados.contato_id,
        dados.tipo,
      ]
    );

    if (!existe) {
      await db.run(
        `
        INSERT INTO meu_contato_usuario
        (
          mensagem_id,
          contato_id,
          tipo
        )
        VALUES (?, ?, ?)
        `,
        [
          dados.mensagem_id,
          dados.contato_id,
          dados.tipo,
        ]
      );
    }

    return NextResponse.json({
      mensagem: "Apagada para mim.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { erro: "Erro ao apagar." },
      { status: 500 }
    );
  }
}