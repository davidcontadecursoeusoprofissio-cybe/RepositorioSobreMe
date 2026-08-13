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
        CREATE TABLE IF NOT EXISTS contato (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mensagem TEXT NOT NULL,
            nome TEXT NOT NULL,
            email TEXT NOT NULL
        )
    `);
return db
}

export async function GET(){
    const db = await abrirBanco();
    
   // Estou criando uma variavel usuario depois acesso o banco puxo os valores da tabela e guardo na variavel
    const contato = await db.all('SELECT * FROM contato')

    return NextResponse.json(contato)
}

//Função feita para cadastra um novo usuario no banco de dados
export async function POST(request){
    //Valor transfomado em json
    const dados = await request.json();

    //json transformado em objeto
    const { mensagem, nome, email }=dados;

    //Chamando a função para abrir o meu banco
    const db = await abrirBanco();

    //executando o comando SQL(Liíguagem que liga e manipula o banco de dados) -INSERT INTO Table
    const resultado = await db.run(
        `INSERT INTO contato (mensagem, nome, email)VALUES (?,?,?)`,
        [mensagem, nome, email ?? null]

    );

  
    return NextResponse.json( {status: 201})
}
