import { Database } from 'sqlite3';

// Criar produto
export function createProduto(db: Database, nome: string, custo: number): void {
  const query = `INSERT INTO produtos (nome, custo) VALUES (?, ?)`;
  db.run(query, [nome, custo], function (err) {
    if (err) {
      console.error('Erro ao criar produto:', err.message);
    } else {
      console.log(`Produto criado com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Obter todos os produtos
export function getAllProdutos(db: Database): Promise<any[]> {
  const query = `SELECT * FROM produtos`;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter produto por ID
export function getProdutoById(db: Database, id: number): Promise<any> {
  const query = `SELECT * FROM produtos WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Atualizar produto
export function updateProduto(db: Database, id: number, nome: string, custo: number): void {
  const query = `UPDATE produtos SET nome = ?, custo = ? WHERE id = ?`;
  db.run(query, [nome, custo, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar produto:', err.message);
    } else {
      console.log(`Produto com ID ${id} atualizado com sucesso.`);
    }
  });
}

// Deletar produto
export function deleteProduto(db: Database, id: number): void {
  const query = `DELETE FROM produtos WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erro ao deletar produto:', err.message);
    } else {
      console.log(`Produto com ID ${id} deletado com sucesso.`);
    }
  });
}
