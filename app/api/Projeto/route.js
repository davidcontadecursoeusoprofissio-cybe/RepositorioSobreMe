import {NextResponse} from "next/server";

import sqlite3 from 'sqlite3'

import {open} from 'sqlite'

import path from "path";
//Função feita para criar a conecxão com o banco de dados
async function abrirBanco(){
    const db = await open({
        filename: path.join(process.cwd(),'database.db'),
        driver: sqlite3.Database

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
return db
}

export async function GET(){
    const db = await abrirBanco();
    
   // Estou criando uma variavel usuario depois acesso o banco puxo os valores da tabela e guardo na variavel
    const projeto = await db.all('SELECT * FROM projeto')

    return NextResponse.json(projeto)
}

//Função feita para cadastra um novo usuario no banco de dados
export async function POST(request){
    //Valor transfomado em json
    const dados = await request.json();

    //json transformado em objeto
    const { titulo,  descricao, img , urlGit}=dados;

    //Chamando a função para abrir o meu banco
    const db = await abrirBanco();

    //executando o comando SQL(Liíguagem que liga e manipula o banco de dados) -INSERT INTO Table
    const resultado = await db.run(
        `INSERT INTO projeto (titulo, descricao, img, urlGit)VALUES (?,?,?,?)`,
        [titulo, descricao, img ,urlGit ?? null]

    );

    


    return NextResponse.json({status: 201})
}
