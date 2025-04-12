import { Database } from 'sqlite3';

// Criar categoria
export function createCategoria(db: Database, nome: string, descricao: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO categorias (nome, descricao) VALUES (?, ?)`;
    db.run(query, [nome, descricao], function (err) {
      if (err) {
        console.error('Erro ao criar categoria:', err.message);
        reject(err);
      } else {
        console.log(`Categoria criada com sucesso, ID: ${this.lastID}`);
        resolve(this.lastID);
      }
    });
  });
}

// Obter todas as categorias
export function getAllCategorias(db: Database): Promise<any[]> {
  const query = `SELECT * FROM categorias ORDER BY nome`;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter categoria por ID
export function getCategoriaById(db: Database, id: number): Promise<any> {
  const query = `SELECT * FROM categorias WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Atualizar categoria
export function updateCategoria(db: Database, id: number, nome: string, descricao: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const query = `UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?`;
    db.run(query, [nome, descricao, id], function (err) {
      if (err) {
        console.error('Erro ao atualizar categoria:', err.message);
        reject(err);
      } else {
        console.log(`Categoria com ID ${id} atualizada com sucesso.`);
        resolve();
      }
    });
  });
}

// Deletar categoria
export function deleteCategoria(db: Database, id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM categorias WHERE id = ?`;
    db.run(query, [id], function (err) {
      if (err) {
        console.error('Erro ao deletar categoria:', err.message);
        reject(err);
      } else {
        console.log(`Categoria com ID ${id} deletada com sucesso.`);
        resolve();
      }
    });
  });
}

// Obter produtos por categoria
export function getProdutosPorCategoria(db: Database, categoriaId: number): Promise<any[]> {
  const query = `
    SELECT p.*, c.nome as categoria_nome
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.categoria_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.all(query, [categoriaId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
