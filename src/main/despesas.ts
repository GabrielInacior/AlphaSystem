import { Database } from 'sqlite3';

// Criar despesa
export function createDespesa(db: Database, descricao: string, valor: number, data: string, tipo: string, origem: string): void {
  const query = `INSERT INTO despesas (descricao, valor, data, tipo, origem) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [descricao, valor, data, tipo, origem], function (err) {
    if (err) {
      console.error('Erro ao criar despesa:', err.message);
    } else {
      console.log(`Despesa criada com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Obter todas as despesas
export function getAllDespesas(db: Database): Promise<any[]> {
  const query = `SELECT * FROM despesas ORDER BY data DESC`;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Atualizar despesa
export function updateDespesa(db: Database, id: number, descricao: string, valor: number, data: string, tipo: string, origem: string): void {
  const query = `UPDATE despesas SET descricao = ?, valor = ?, data = ?, tipo = ?, origem = ? WHERE id = ?`;
  db.run(query, [descricao, valor, data, tipo, origem, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar despesa:', err.message);
    } else {
      console.log(`Despesa com ID ${id} atualizada com sucesso.`);
    }
  });
}

// Deletar despesa
export function deleteDespesa(db: Database, id: number): void {
  const query = `DELETE FROM despesas WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erro ao deletar despesa:', err.message);
    } else {
      console.log(`Despesa com ID ${id} deletada com sucesso.`);
    }
  });
}

