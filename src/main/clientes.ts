import { Database } from 'sqlite3'
import { queryDatabase } from './database'

export class Cliente {
  constructor(
    public nome: string,
    public aniversario: string
  ) {}

  // Função para cadastrar um cliente
  static async cadastrarCliente(db: Database, nome: string, aniversario: string) {
    await queryDatabase(
      db,
      `INSERT INTO clientes (nome, aniversario) VALUES (?, ?)`,
      [nome, aniversario]
    )
  }

  // Função para buscar clientes com aniversário no mês atual
  static async buscarAniversariantes(db: Database) {
    const dataAtual = new Date()
    const mesAtual = dataAtual.getMonth() + 1 // Mes é 0-based
    const clientes = await queryDatabase(
      db,
      `SELECT * FROM clientes WHERE strftime('%m', aniversario) = ?`,
      [String(mesAtual).padStart(2, '0')]
    )
    return clientes
  }
}
