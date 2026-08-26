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
    CREATE TABLE IF NOT EXISTS projeto (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      img TEXT,
      urlGit TEXT
    )
  `);

  return db;
}

export async function GET() {
  const db = await abrirBanco();

  const projeto = await db.all(
    "SELECT * FROM projeto"
  );

  return NextResponse.json(projeto);
}

export async function POST(request) {
  try {
    const dados = await request.json();

    const {
      titulo,
      descricao,
      img,
      urlGit
    } = dados;

    const db = await abrirBanco();

    await db.run(
      `
      INSERT INTO projeto
      (titulo, descricao, img, urlGit)
      VALUES (?, ?, ?, ?)
      `,
      [
        titulo,
        descricao,
        img,
        urlGit ?? null
      ]
    );

    return NextResponse.json(
      {
        message: "Projeto cadastrado com sucesso"
      },
      {
        status: 201
      }
    );

  } catch (error) {
    console.error(
      "Erro ao cadastrar projeto:",
      error
    );

    return NextResponse.json(
      {
        error: "Erro ao cadastrar projeto"
      },
      {
        status: 500
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "ID não fornecido"
        },
        {
          status: 400
        }
      );
    }

    const db = await abrirBanco();

    await db.run(
      "DELETE FROM projeto WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      message:
        "Projeto excluído com sucesso"
    });

  } catch (error) {
    console.error(
      "Erro ao apagar projeto:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro interno no servidor"
      },
      {
        status: 500
      }
    );
  }
}