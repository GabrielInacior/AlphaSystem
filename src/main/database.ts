/* eslint-disable @typescript-eslint/no-explicit-any */
import sqlite3, { Database } from 'sqlite3'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'


const dbPath = path.join(app.getPath('userData'), 'myAppData.sqlite')

console.log('Caminho do banco de dados:', dbPath)


const dirPath = path.dirname(dbPath)
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true })
}


export function initDB(): Database {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err.message)
    } else {
      console.log('Banco de dados conectado.')
    }
  })
  return db
}


export async function createTables(db: sqlite3.Database): Promise<void> {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS clientes (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       nome TEXT NOT NULL,
       telefone TEXT,
       aniversario DATE
      );
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL
    );
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      custo REAL,
      preco REAL,
      qtdEstoque INTEGER DEFAULT 0,
      lucroPorcentagem REAL
    );
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER,
        valor_total REAL,
        valor_pago REAL DEFAULT 0,
        metodo_pagamento TEXT,
        status TEXT,
        data DATE,
        FOREIGN KEY(cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
      );
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS vendas_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id INTEGER,
        produto_id INTEGER,
        servico_id INTEGER,
        quantidade INTEGER,
        valor_unitario REAL,
        valor_total REAL,
        FOREIGN KEY(venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
        FOREIGN KEY(produto_id) REFERENCES produtos(id),
        FOREIGN KEY(servico_id) REFERENCES servicos(id)
      );
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS despesas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT,
        valor REAL,
        data DATE,
        tipo TEXT
      );
    `)

  })
}

// Função para consultar o banco de dados
export function queryDatabase(
  db: sqlite3.Database,
  query: string,
  params: any[] = []
): Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}
