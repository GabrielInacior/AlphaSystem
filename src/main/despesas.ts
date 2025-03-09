import { Database } from 'sqlite3';

// Criar despesa
export function createDespesa(db: Database, descricao: string, valor: number, data: string, tipo : string): void {
  const query = `INSERT INTO despesas (descricao, valor, data, tipo) VALUES (?, ?, ?, ?)`;
  db.run(query, [descricao, valor, data, tipo], function (err) {
    if (err) {
      console.error('Erro ao criar despesa:', err.message);
    } else {
      console.log(`Despesa criada com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Obter todas as despesas
export function getAllDespesas(db: Database): Promise<any[]> {
  const query = `SELECT * FROM despesas`;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
