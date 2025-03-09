import { Database } from 'sqlite3'
import { queryDatabase } from './database'

export class Pagamento {
  constructor(
    public venda_id: number,
    public metodo_pagamento: string,
    public valor_pago: number,
    public data: string
  ) {}

  // Função para registrar um pagamento
  static async registrarPagamento(db: Database, venda_id: number, metodo_pagamento: string, valor_pago: number, data: string) {
    await queryDatabase(
      db,
      `INSERT INTO pagamentos (venda_id, metodo_pagamento, valor_pago, data) VALUES (?, ?, ?, ?)`,
      [venda_id, metodo_pagamento, valor_pago, data]
    )
  }
}
