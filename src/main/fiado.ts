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

// Atualizar fiado
export function updateFiado(db: Database, id: number, cliente_id: number, valor: number, data: string): void {
  const query = `UPDATE fiado SET cliente_id = ?, valor = ?, data = ? WHERE id = ?`;
  db.run(query, [cliente_id, valor, data, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar fiado:', err.message);
    } else {
      console.log(`Fiado com ID ${id} atualizado com sucesso.`);
    }
  });
}

// Deletar fiado
export function deleteFiado(db: Database, id: number): void {
  const query = `DELETE FROM fiado WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erro ao deletar fiado:', err.message);
    } else {
      console.log(`Fiado com ID ${id} deletado com sucesso.`);
    }
  });
}

