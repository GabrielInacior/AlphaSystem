import { Database } from 'sqlite3'
import { queryDatabase } from './database'

export class Fiado {
  constructor(
    public cliente_id: number,
    public valor: number,
    public descricao: string,
    public data: string,
    public status: string
  ) {}

  // Função para registrar um fiado
  static async registrarFiado(db: Database, cliente_id: number, valor: number, descricao: string, data: string, status: string) {
    await queryDatabase(
      db,
      `INSERT INTO fiado (cliente_id, valor, descricao, data, status) VALUES (?, ?, ?, ?, ?)`,
      [cliente_id, valor, descricao, data, status]
    )
  }

  // Função para buscar fiados pendentes
  static async buscarFiadosPendentes(db: Database) {
    return await queryDatabase(
      db,
      `SELECT * FROM fiado WHERE status = 'pendente'`
    )
  }
}
