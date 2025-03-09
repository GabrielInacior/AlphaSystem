import { Database } from 'sqlite3'
import { queryDatabase } from './database'

export class Produto {
  constructor(
    public nome: string,
    public custo: number
  ) {}

  // Função para cadastrar um produto
  static async cadastrarProduto(db: Database, nome: string, custo: number) {
    await queryDatabase(
      db,
      `INSERT INTO produtos (nome, custo) VALUES (?, ?)`,
      [nome, custo]
    )
  }

  // Função para buscar todos os produtos
  static async buscarProdutos(db: Database) {
    return await queryDatabase(db, `SELECT * FROM produtos`)
  }
}
