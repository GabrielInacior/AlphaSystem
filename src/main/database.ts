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
    // Criar tabelas se não existirem
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
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT
      );
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      custo REAL,
      preco REAL,
      qtdEstoque INTEGER DEFAULT 0,
      lucroPorcentagem REAL,
      categoria_id INTEGER,
      FOREIGN KEY(categoria_id) REFERENCES categorias(id)
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

    db.run(`
      CREATE TABLE IF NOT EXISTS contas_pagar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        data_vencimento DATE NOT NULL,
        data_pagamento DATE,
        status TEXT DEFAULT 'pendente',
        observacao TEXT,
        fornecedor TEXT,
        tipo TEXT,
        forma_pagamento TEXT
      );
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS creditos_clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        valor REAL NOT NULL,
        data_credito DATE NOT NULL,
        data_utilizacao DATE,
        status TEXT DEFAULT 'disponivel',
        observacao TEXT,
        FOREIGN KEY(cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
      );
    `)

  })
}

// Função para verificar e atualizar a estrutura do banco de dados
export async function checkAndUpdateDatabase(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Verificar se a coluna categoria_id existe na tabela produtos
      db.get("SELECT * FROM pragma_table_info('produtos') WHERE name='categoria_id'", (err, row) => {
        if (err) {
          console.error('Erro ao verificar coluna categoria_id:', err);
          reject(err);
          return;
        }

        // Se a coluna não existir, adicionar
        if (!row) {
          console.log('Adicionando coluna categoria_id à tabela produtos...');
          db.run("ALTER TABLE produtos ADD COLUMN categoria_id INTEGER REFERENCES categorias(id)", (err) => {
            if (err) {
              console.error('Erro ao adicionar coluna categoria_id:', err);
              reject(err);
              return;
            }
            console.log('Coluna categoria_id adicionada com sucesso.');
            resolve();
          });
        } else {
          console.log('Coluna categoria_id já existe na tabela produtos.');
          resolve();
        }
      });

      // Verificar se a coluna origem existe na tabela despesas
      db.get("SELECT * FROM pragma_table_info('despesas') WHERE name='origem'", (err, row) => {
        if (err) {
          console.error('Erro ao verificar coluna origem:', err);
          return;
        }

        // Se a coluna não existir, adicionar
        if (!row) {
          console.log('Adicionando coluna origem à tabela despesas...');
          db.run("ALTER TABLE despesas ADD COLUMN origem TEXT DEFAULT 'Loja'", (err) => {
            if (err) {
              console.error('Erro ao adicionar coluna origem:', err);
              return;
            }
            console.log('Coluna origem adicionada com sucesso.');
          });
        } else {
          console.log('Coluna origem já existe na tabela despesas.');
        }
      });

      // Verificar se a coluna desconto existe na tabela vendas
      db.get("SELECT * FROM pragma_table_info('vendas') WHERE name='desconto'", (err, row) => {
        if (err) {
          console.error('Erro ao verificar coluna desconto:', err);
          return;
        }

        // Se a coluna não existir, adicionar
        if (!row) {
          console.log('Adicionando coluna desconto à tabela vendas...');
          db.run("ALTER TABLE vendas ADD COLUMN desconto REAL DEFAULT 0", (err) => {
            if (err) {
              console.error('Erro ao adicionar coluna desconto:', err);
              return;
            }
            console.log('Coluna desconto adicionada com sucesso.');
          });
        } else {
          console.log('Coluna desconto já existe na tabela vendas.');
        }
      });
    });
  });
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
