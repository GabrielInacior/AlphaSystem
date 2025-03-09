import { Database } from 'sqlite3'
import { queryDatabase } from './database'

export class Servico {
  constructor(
    public nome: string,
    public preco: number,
    public desconto: number
  ) {}

  // Função para cadastrar um serviço
  static async cadastrarServico(db: Database, nome: string, preco: number, desconto: number) {
    await queryDatabase(
      db,
      `INSERT INTO servicos (nome, preco, desconto) VALUES (?, ?, ?)`,
      [nome, preco, desconto]
    )
  }

  // Função para buscar todos os serviços
  static async buscarServicos(db: Database) {
    return await queryDatabase(db, `SELECT * FROM servicos`)
  }
}
