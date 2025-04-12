import { Database } from 'sqlite3';

// Criar produto
export function createProduto(db: Database, nome: string, custo: number, preco: number, qtdEstoque: number, categoria_id: number): void {
  const lucroPorcentagem = ((preco - custo) / custo) * 100;

  const query = `INSERT INTO produtos (nome, custo, preco, qtdEstoque, lucroPorcentagem, categoria_id) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [nome, custo, preco, qtdEstoque, lucroPorcentagem, categoria_id], function (err) {
    if (err) {
      console.error('Erro ao criar produto:', err.message);
    } else {
      console.log(`Produto criado com sucesso, ID: ${this.lastID}`);
    }
  });
}

// Obter todos os produtos
export function getAllProdutos(db: Database): Promise<any[]> {
  const query = `
    SELECT p.*, c.nome as categoria_nome
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    ORDER BY p.nome
  `;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter produto por ID
export function getProdutoById(db: Database, id: number): Promise<any> {
  const query = `
    SELECT p.*, c.nome as categoria_nome
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ?
  `;
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Atualizar produto
export function updateProduto(db: Database, id: number, nome: string, custo: number, preco: number, qtdEstoque: number, categoria_id: number): void {
  const lucroPorcentagem = ((preco - custo) / custo) * 100;

  const query = `UPDATE produtos SET nome = ?, custo = ?, preco = ?, qtdEstoque = ?, lucroPorcentagem = ?, categoria_id = ? WHERE id = ?`;
  db.run(query, [nome, custo, preco, qtdEstoque, lucroPorcentagem, categoria_id, id], function (err) {
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

// Atualizar estoque após venda
export function atualizarEstoqueProduto(db: Database, id: number, quantidadeVendida: number): void {
  const query = `UPDATE produtos SET qtdEstoque = qtdEstoque - ? WHERE id = ? AND qtdEstoque >= ?`;
  db.run(query, [quantidadeVendida, id, quantidadeVendida], function (err) {
    if (err) {
      console.error('Erro ao atualizar estoque:', err.message);
    } else if (this.changes === 0) {
      console.error('Estoque insuficiente para a venda.');
    } else {
      console.log(`Estoque do produto com ID ${id} atualizado com sucesso.`);
    }
  });
}




