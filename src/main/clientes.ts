import { Database } from 'sqlite3';

// Criar cliente
export function createCliente(db: Database, nome: string, aniversario: string, telefone: string): void {
  const query = `INSERT INTO clientes (nome, aniversario, telefone) VALUES (?, ?, ?)`;
  console.log(telefone)
  db.run(query, [nome, aniversario, telefone], function (err) {
    if (err) {
      console.error('Erro ao criar cliente:', err.message);
    } else {
      console.log(`Cliente criado com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Obter todos os clientes
export function getAllClientes(db: Database): Promise<any[]> {
  const query = `SELECT * FROM clientes`;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter cliente por ID
export function getClienteById(db: Database, id: number): Promise<any> {
  const query = `SELECT * FROM clientes WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Atualizar cliente
export function updateCliente(db: Database, id: number, nome: string, aniversario: string, telefone: string): void {
  console.log(id);
  console.log(telefone);
  const query = `UPDATE clientes SET nome = ?, aniversario = ?, telefone = ? WHERE id = ?`;
  db.run(query, [nome, aniversario, telefone, id], function (err) { // Correção na ordem dos parâmetros
    if (err) {
      console.error('Erro ao atualizar cliente:', err.message);
    } else {
      console.log(`Cliente com ID ${id} atualizado com sucesso.`);
    }
  });
}

// Deletar cliente
export function deleteCliente(db: Database, id: number): void {
  const query = `DELETE FROM clientes WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erro ao deletar cliente:', err.message);
    } else {
      console.log(`Cliente com ID ${id} deletado com sucesso.`);
    }
  });
}
