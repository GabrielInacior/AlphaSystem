import { Database } from 'sqlite3'
import { queryDatabase } from './database'

export class FechamentoCaixa {
  constructor(
    public tipo: string, // "barbearia", "loja", "perfume"
    public total_mes: number,
    public total_semana: number,
    public total_dia: number,
    public total_cartao: number,
    public total_pix: number,
    public total_dinheiro: number,
    public total_banco: number,
    public data: string
  ) {}

  // Função para registrar o fechamento de caixa
  static async registrarFechamento(db: Database, fechamento: FechamentoCaixa) {
    await queryDatabase(
      db,
      `INSERT INTO fechamento_caixa (tipo, total_mes, total_semana, total_dia, total_cartao, total_pix, total_dinheiro, total_banco, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fechamento.tipo,
        fechamento.total_mes,
        fechamento.total_semana,
        fechamento.total_dia,
        fechamento.total_cartao,
        fechamento.total_pix,
        fechamento.total_dinheiro,
        fechamento.total_banco,
        fechamento.data
      ]
    )
  }
}
