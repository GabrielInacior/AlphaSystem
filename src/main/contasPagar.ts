import { Database } from 'sqlite3';

// Interface para a conta a pagar
interface ContaPagar {
  id: number;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  fornecedor: string;
  tipo: string;
  observacao?: string;
  forma_pagamento?: string;
  status: string;
}

// Interface para o resultado do total
interface TotalResult {
  total: number;
}

// Criar conta a pagar
export function createContaPagar(
  db: Database,
  descricao: string,
  valor: number,
  data_vencimento: string,
  fornecedor: string,
  tipo: string,
  observacao?: string,
  forma_pagamento?: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO contas_pagar (
      descricao,
      valor,
      data_vencimento,
      fornecedor,
      tipo,
      observacao,
      forma_pagamento,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente')`;

    db.run(
      query,
      [descricao, valor, data_vencimento, fornecedor, tipo, observacao, forma_pagamento],
      function (err) {
        if (err) {
          console.error('Erro ao criar conta a pagar:', err.message);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      }
    );
  });
}

// Obter todas as contas a pagar
export function getAllContasPagar(db: Database): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM contas_pagar
      ORDER BY
        CASE
          WHEN status = 'pendente' THEN 1
          ELSE 2
        END,
        data_vencimento ASC
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar contas a pagar:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Obter conta a pagar por ID
export function getContaPagarById(db: Database, id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM contas_pagar WHERE id = ?';

    db.get(query, [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar conta a pagar:', err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Atualizar conta a pagar
export function updateContaPagar(
  db: Database,
  id: number,
  descricao: string,
  valor: number,
  data_vencimento: string,
  fornecedor: string,
  tipo: string,
  observacao?: string,
  forma_pagamento?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE contas_pagar
      SET descricao = ?,
          valor = ?,
          data_vencimento = ?,
          fornecedor = ?,
          tipo = ?,
          observacao = ?,
          forma_pagamento = ?
      WHERE id = ?
    `;

    db.run(
      query,
      [descricao, valor, data_vencimento, fornecedor, tipo, observacao, forma_pagamento, id],
      (err) => {
        if (err) {
          console.error('Erro ao atualizar conta a pagar:', err.message);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

// Marcar conta como paga
export function marcarContaComoPaga(
  db: Database,
  id: number,
  data_pagamento: string,
  forma_pagamento: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Iniciar uma transação para garantir que ambas as operações sejam concluídas
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // Primeiro, buscar os dados da conta
      const queryBusca = 'SELECT * FROM contas_pagar WHERE id = ?';
      db.get(queryBusca, [id], (err, conta: ContaPagar) => {
        if (err) {
          db.run('ROLLBACK');
          console.error('Erro ao buscar conta:', err.message);
          reject(err);
          return;
        }

        if (!conta) {
          db.run('ROLLBACK');
          reject(new Error('Conta não encontrada'));
          return;
        }

        // Atualizar o status da conta para pago
        const queryUpdate = `
          UPDATE contas_pagar
          SET status = 'pago',
              data_pagamento = ?,
              forma_pagamento = ?
          WHERE id = ?
        `;

        db.run(queryUpdate, [data_pagamento, forma_pagamento, id], (err) => {
          if (err) {
            db.run('ROLLBACK');
            console.error('Erro ao marcar conta como paga:', err.message);
            reject(err);
            return;
          }

          // Criar uma nova despesa com os dados da conta
          const queryDespesa = `
            INSERT INTO despesas (descricao, valor, data, tipo, origem)
            VALUES (?, ?, ?, ?, ?)
          `;

          // Usar a data atual para a despesa
          const dataAtual = new Date().toISOString().split('T')[0];
          const descricaoDespesa = `Pagamento de Conta: ${conta.fornecedor} - ${conta.descricao}`;

          db.run(queryDespesa, [
            descricaoDespesa,
            conta.valor,
            dataAtual,  // Usando a data atual
            'Conta',    // Tipo fixo como 'Conta'
            'Outro'     // Origem fixa como 'Outro'
          ], (err) => {
            if (err) {
              db.run('ROLLBACK');
              console.error('Erro ao criar despesa:', err.message);
              reject(err);
              return;
            }

            db.run('COMMIT', (err) => {
              if (err) {
                db.run('ROLLBACK');
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });
      });
    });
  });
}

// Deletar conta a pagar
export function deleteContaPagar(db: Database, id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM contas_pagar WHERE id = ?';

    db.run(query, [id], (err) => {
      if (err) {
        console.error('Erro ao deletar conta a pagar:', err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Obter contas a pagar por status
export function getContasPagarPorStatus(db: Database, status: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM contas_pagar
      WHERE status = ?
      ORDER BY data_vencimento ASC
    `;

    db.all(query, [status], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar contas a pagar por status:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Obter contas a pagar por período
export function getContasPagarPorPeriodo(
  db: Database,
  dataInicio: string,
  dataFim: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM contas_pagar
      WHERE data_vencimento BETWEEN ? AND ?
      ORDER BY data_vencimento ASC
    `;

    db.all(query, [dataInicio, dataFim], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar contas a pagar por período:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Obter total de contas a pagar por status
export function getTotalContasPagarPorStatus(db: Database, status: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT SUM(valor) as total
      FROM contas_pagar
      WHERE status = ?
    `;

    db.get(query, [status], (err, row: TotalResult) => {
      if (err) {
        console.error('Erro ao calcular total de contas a pagar:', err.message);
        reject(err);
      } else {
        resolve(row?.total || 0);
      }
    });
  });
}

// Obter contas vencidas
export function getContasVencidas(db: Database): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM contas_pagar
      WHERE status = 'pendente'
      AND data_vencimento < date('now')
      ORDER BY data_vencimento ASC
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar contas vencidas:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Obter contas a vencer em X dias
export function getContasAVencer(db: Database, dias: number): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM contas_pagar
      WHERE status = 'pendente'
      AND data_vencimento BETWEEN date('now') AND date('now', '+' || ? || ' days')
      ORDER BY data_vencimento ASC
    `;

    db.all(query, [dias], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar contas a vencer:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
