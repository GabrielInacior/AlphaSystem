import { Database } from 'sqlite3';

// Criar venda de serviço
export function createVendaServico(db: Database, cliente_id: number, servico_id: number, valor_total: number, metodo_pagamento: string, data: string): void {
  const query = `INSERT INTO vendas_servicos (cliente_id, servico_id, valor_total, metodo_pagamento, data) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [cliente_id, servico_id, valor_total, metodo_pagamento, data], function (err) {
    if (err) {
      console.error('Erro ao criar venda de serviço:', err.message);
    } else {
      console.log(`Venda de serviço criada com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Criar venda de produto
export function createVendaProduto(db: Database, cliente_id: number, produto_id: number, quantidade: number, valor_total: number, metodo_pagamento: string, data: string): void {
  const query = `INSERT INTO vendas_produtos (cliente_id, produto_id, quantidade, valor_total, metodo_pagamento, data) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [cliente_id, produto_id, quantidade, valor_total, metodo_pagamento, data], function (err) {
    if (err) {
      console.error('Erro ao criar venda de produto:', err.message);
    } else {
      console.log(`Venda de produto criada com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Obter todas as vendas
export function getAllVendas(db: Database, tabela: 'vendas_servicos' | 'vendas_produtos'): Promise<any[]> {
  const query = `SELECT * FROM ${tabela}`;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter venda por ID
export function getVendaById(db: Database, tabela: 'vendas_servicos' | 'vendas_produtos', id: number): Promise<any> {
  const query = `SELECT * FROM ${tabela} WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
