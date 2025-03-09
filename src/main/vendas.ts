import { Database } from 'sqlite3'
import { queryDatabase } from './database'

export class VendaServico {
  constructor(
    public cliente_id: number,
    public servico_id: number,
    public valor_total: number,
    public metodo_pagamento: string,
    public data: string
  ) {}

  // Função para registrar uma venda de serviço
  static async registrarVendaServico(db: Database, cliente_id: number, servico_id: number, valor_total: number, metodo_pagamento: string, data: string) {
    await queryDatabase(
      db,
      `INSERT INTO vendas_servicos (cliente_id, servico_id, valor_total, metodo_pagamento, data) VALUES (?, ?, ?, ?, ?)`,
      [cliente_id, servico_id, valor_total, metodo_pagamento, data]
    )
  }
}

export class VendaProduto {
  constructor(
    public cliente_id: number,
    public produto_id: number,
    public quantidade: number,
    public valor_total: number,
    public metodo_pagamento: string,
    public data: string
  ) {}

  // Função para registrar uma venda de produto
  static async registrarVendaProduto(db: Database, cliente_id: number, produto_id: number, quantidade: number, valor_total: number, metodo_pagamento: string, data: string) {
    await queryDatabase(
      db,
      `INSERT INTO vendas_produtos (cliente_id, produto_id, quantidade, valor_total, metodo_pagamento, data) VALUES (?, ?, ?, ?, ?, ?)`,
      [cliente_id, produto_id, quantidade, valor_total, metodo_pagamento, data]
    )
  }
}
