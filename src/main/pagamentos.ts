import { Database } from 'sqlite3';

// Criar pagamento
export function createPagamento(db: Database, venda_id: number, metodo_pagamento: string, valor_pago: number, data: string): void {
  const query = `INSERT INTO pagamentos (venda_id, metodo_pagamento, valor_pago, data) VALUES (?, ?, ?, ?)`;
  db.run(query, [venda_id, metodo_pagamento, valor_pago, data], function (err) {
    if (err) {
      console.error('Erro ao criar pagamento:', err.message);
    } else {
      console.log(`Pagamento registrado com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Obter pagamentos por venda
export function getPagamentosPorVenda(db: Database, venda_id: number): Promise<any[]> {
  const query = `SELECT * FROM pagamentos WHERE venda_id = ?`;
  return new Promise((resolve, reject) => {
    db.all(query, [venda_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
