/* eslint-disable @typescript-eslint/no-explicit-any */
import sqlite3, { Database } from 'sqlite3'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'

// Caminho do banco de dados
const dbPath = path.join(app.getPath('userData'), 'myAppData')

console.log('Caminho do banco de dados:', dbPath) // Verifique se o caminho está correto

// Certifique-se de que o diretório existe
const dirPath = path.dirname(dbPath) // O diretório onde o banco de dados será armazenado
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

// Função para criar as tabelas
export function createTables(db: sqlite3.Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      aniversario DATE
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL,
      desconto REAL
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS vendas_servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER,
      servico_id INTEGER,
      valor_total REAL,
      metodo_pagamento TEXT,
      data DATE,
      FOREIGN KEY(cliente_id) REFERENCES clientes(id),
      FOREIGN KEY(servico_id) REFERENCES servicos(id)
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      custo REAL
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS vendas_produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER,
      produto_id INTEGER,
      quantidade INTEGER,
      valor_total REAL,
      metodo_pagamento TEXT,
      data DATE,
      FOREIGN KEY(cliente_id) REFERENCES clientes(id),
      FOREIGN KEY(produto_id) REFERENCES produtos(id)
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS pagamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venda_id INTEGER,
      metodo_pagamento TEXT,
      valor_pago REAL,
      data DATE,
      FOREIGN KEY(venda_id) REFERENCES vendas_servicos(id)
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS despesas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT,
      valor REAL,
      data DATE
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS fiado (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER,
      valor REAL,
      descricao TEXT,
      data DATE,
      status TEXT, -- Pode ser "pendente", "pago", etc.
      FOREIGN KEY(cliente_id) REFERENCES clientes(id)
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS fechamento_caixa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT, -- Pode ser "barbearia", "loja", "perfume"
      total_mes REAL,
      total_semana REAL,
      total_dia REAL,
      total_cartao REAL,
      total_pix REAL,
      total_dinheiro REAL,
      total_banco REAL,
      data DATE
    );
  `)
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
