import { Database } from 'sqlite3';

export function createFechamentoCaixa(
  db: Database,
  tipo: string,
  total_vendas: number,
  total_despesas: number,
  total_cartao: number,
  total_pix: number,
  total_dinheiro: number,
  total_banco: number,
  data: string
): void {
  const query = `
    INSERT INTO fechamento_caixa (tipo, total_vendas, total_despesas, total_cartao, total_pix, total_dinheiro, total_banco, data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [tipo, total_vendas, total_despesas, total_cartao, total_pix, total_dinheiro, total_banco, data], function (err) {
    if (err) {
      console.error('Erro ao criar fechamento de caixa:', err.message);
    } else {
      console.log(`Fechamento de caixa (${tipo}) criado com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Obter fechamento de caixa por tipo (Barbearia ou Loja) e data
export function getFechamentoCaixaPorData(
  db: Database,
  tipo: string, // "barbearia" ou "loja"
  data: string
): Promise<any[]> {
  const query = `SELECT * FROM fechamento_caixa WHERE tipo = ? AND data = ?`;
  return new Promise((resolve, reject) => {
    db.all(query, [tipo, data], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter todos os fechamentos de caixa por tipo (Barbearia ou Loja)
export function getFechamentoCaixaPorTipo(
  db: Database,
  tipo: string // "barbearia" ou "loja"
): Promise<any[]> {
  const query = `SELECT * FROM fechamento_caixa WHERE tipo = ?`;
  return new Promise((resolve, reject) => {
    db.all(query, [tipo], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter fechamento de caixa por ID
export function getFechamentoCaixaPorId(
  db: Database,
  id: number
): Promise<any> {
  const query = `SELECT * FROM fechamento_caixa WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Atualizar fechamento de caixa (pode ser usado para atualizar vendas, despesas, etc.)
export function updateFechamentoCaixa(
  db: Database,
  id: number,
  total_vendas: number,
  total_despesas: number,
  total_cartao: number,
  total_pix: number,
  total_dinheiro: number,
  total_banco: number,
  data: string
): void {
  const query = `
    UPDATE fechamento_caixa
    SET total_vendas = ?, total_despesas = ?, total_cartao = ?, total_pix = ?, total_dinheiro = ?, total_banco = ?, data = ?
    WHERE id = ?
  `;
  db.run(query, [total_vendas, total_despesas, total_cartao, total_pix, total_dinheiro, total_banco, data, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar fechamento de caixa:', err.message);
    } else {
      console.log(`Fechamento de caixa (${id}) atualizado com sucesso.`);
    }
  });
}
