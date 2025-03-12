import { Database } from 'sqlite3';

// Criar serviço
export function createServico(db: Database, nome: string, preco: number): void {
  const query = `INSERT INTO servicos (nome, preco) VALUES (?, ?)`;
  db.run(query, [nome, preco], function (err) {
    if (err) {
      console.error('Erro ao criar serviço:', err.message);
    } else {
      console.log(`Serviço criado com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Obter todos os serviços
export function getAllServicos(db: Database): Promise<any[]> {
  const query = `SELECT * FROM servicos`;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter serviço por ID
export function getServicoById(db: Database, id: number): Promise<any> {
  const query = `SELECT * FROM servicos WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Atualizar serviço
export function updateServico(db: Database, id: number, nome: string, preco: number): void {
  const query = `UPDATE servicos SET nome = ?, preco = ? WHERE id = ?`;
  db.run(query, [nome, preco, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar serviço:', err.message);
    } else {
      console.log(`Serviço com ID ${id} atualizado com sucesso.`);
    }
  });
}

// Deletar serviço
export function deleteServico(db: Database, id: number): void {
  const query = `DELETE FROM servicos WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erro ao deletar serviço:', err.message);
    } else {
      console.log(`Serviço com ID ${id} deletado com sucesso.`);
    }
  });
}
