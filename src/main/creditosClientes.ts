import { Database } from 'sqlite3';

// Criar novo crédito
export function createCreditoCliente(
  db: Database,
  cliente_id: number,
  valor: number,
  data_credito: string,
  observacao?: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO creditos_clientes (
        cliente_id,
        valor,
        data_credito,
        observacao,
        status
      ) VALUES (?, ?, ?, ?, 'disponivel')
    `;

    db.run(query, [cliente_id, valor, data_credito, observacao], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}

// Obter todos os créditos
export function getAllCreditosClientes(db: Database): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        cc.*,
        c.nome as cliente_nome
      FROM creditos_clientes cc
      JOIN clientes c ON cc.cliente_id = c.id
      ORDER BY cc.data_credito DESC
    `;

    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter créditos por cliente
export function getCreditosClienteById(db: Database, cliente_id: number): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        cc.*,
        c.nome as cliente_nome
      FROM creditos_clientes cc
      JOIN clientes c ON cc.cliente_id = c.id
      WHERE cc.cliente_id = ?
      ORDER BY cc.data_credito DESC
    `;

    db.all(query, [cliente_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter saldo total disponível por cliente
export function getSaldoCreditoCliente(db: Database, cliente_id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        SUM(valor) as saldo_total
      FROM creditos_clientes
      WHERE cliente_id = ? AND status = 'disponivel'
    `;

    db.get(query, [cliente_id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Utilizar crédito
export function utilizarCreditoCliente(
  db: Database,
  credito_id: number,
  data_utilizacao: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE creditos_clientes
      SET status = 'utilizado',
          data_utilizacao = ?
      WHERE id = ? AND status = 'disponivel'
    `;

    db.run(query, [data_utilizacao, credito_id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Estornar crédito utilizado
export function estornarCreditoCliente(
  db: Database,
  credito_id: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE creditos_clientes
      SET status = 'disponivel',
          data_utilizacao = NULL
      WHERE id = ? AND status = 'utilizado'
    `;

    db.run(query, [credito_id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Deletar crédito (apenas se estiver disponível)
export function deleteCreditoCliente(
  db: Database,
  credito_id: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM creditos_clientes
      WHERE id = ? AND status = 'disponivel'
    `;

    db.run(query, [credito_id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
