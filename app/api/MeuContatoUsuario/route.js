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
    CREATE TABLE IF NOT EXISTS usuario_apagadas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mensagem_id INTEGER NOT NULL,
      tipo TEXT NOT NULL
    )
  `);

  return db;
}


// ======================================
// BUSCAR
// ======================================

export async function GET() {
  try {

    const db = await abrirBanco();

    const dados = await db.all(`
      SELECT *
      FROM usuario_apagadas
      ORDER BY id ASC
    `);

    return NextResponse.json(dados);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        erro: "Erro ao buscar apagadas."
      },
      {
        status: 500
      }
    );
  }
}


// ======================================
// APAGAR PARA MIM
// ======================================

export async function POST(request) {
  try {

    const dados = await request.json();

    const db = await abrirBanco();

    const mensagemId =
      Number(dados.mensagem_id);

    const tipo =
      dados.tipo;


    const existe = await db.get(
      `
      SELECT *
      FROM usuario_apagadas
      WHERE mensagem_id = ?
      AND tipo = ?
      `,
      [
        mensagemId,
        tipo
      ]
    );


    if (!existe) {

      await db.run(
        `
        INSERT INTO usuario_apagadas
        (
          mensagem_id,
          tipo
        )
        VALUES (?, ?)
        `,
        [
          mensagemId,
          tipo
        ]
      );

    }


    return NextResponse.json({
      mensagem:
        "Apagada para mim."
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        erro:
          "Erro ao apagar para mim."
      },
      {
        status: 500
      }
    );
  }
}


// ======================================
// APAGAR PARA TODOS
// ======================================

export async function DELETE(request) {
  try {

    const { searchParams } =
      new URL(request.url);

    const id =
      Number(
        searchParams.get("id")
      );

    const tipo =
      searchParams.get("tipo");


    if (!id) {

      return NextResponse.json(
        {
          erro: "ID inválido."
        },
        {
          status: 400
        }
      );
    }


    const db = await abrirBanco();


    // ==================================
    // APAGAR REGISTRO DO USUARIO
    // ==================================

    if (tipo === "todos") {

      await db.run(
        `
        DELETE FROM usuario_apagadas
        WHERE mensagem_id = ?
        `,
        [id]
      );


      return NextResponse.json({
        mensagem:
          "Mensagem apagada para todos."
      });
    }


    return NextResponse.json(
      {
        erro: "Tipo inválido."
      },
      {
        status: 400
      }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        erro:
          "Erro ao apagar para todos."
      },
      {
        status: 500
      }
    );
  }
}