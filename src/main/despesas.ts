import { Database } from 'sqlite3'
import { queryDatabase } from './database'

export class Despesa {
  constructor(
    public descricao: string,
    public valor: number,
    public data: string
  ) {}

  // Função para registrar uma despesa
  static async registrarDespesa(db: Database, descricao: string, valor: number, data: string) {
    await queryDatabase(
      db,
      `INSERT INTO despesas (descricao, valor, data) VALUES (?, ?, ?)`,
      [descricao, valor, data]
    )
  }

  // Função para buscar despesas no mês atual
  static async buscarDespesasMensais(db: Database) {
    const dataAtual = new Date()
    const mesAtual = dataAtual.getMonth() + 1 // Mes é 0-based
    return await queryDatabase(
      db,
      `SELECT * FROM despesas WHERE strftime('%m', data) = ?`,
      [String(mesAtual).padStart(2, '0')]
    )
  }
}
