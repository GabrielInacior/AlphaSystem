import { Database } from 'sqlite3';

// Criar fiado
export function createFiado(db: Database, cliente_id: number, valor: number, data: string): void {
  const query = `INSERT INTO fiado (cliente_id, valor, data) VALUES (?, ?, ?)`;
  db.run(query, [cliente_id, valor, data], function (err) {
    if (err) {
      console.error('Erro ao criar fiado:', err.message);
    } else {
      console.log(`Fiado criado com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Obter todos os fiados
export function getAllFiados(db: Database): Promise<any[]> {
  const query = `SELECT * FROM fiado`;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
