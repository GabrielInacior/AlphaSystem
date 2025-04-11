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

export function getClientesAniversariantes(db: Database): Promise<any[]> {
  const query = `
    SELECT *, strftime('%Y-%m-%d', aniversario) AS aniversario_formatado
    FROM clientes
    WHERE strftime('%m', aniversario) = strftime('%m', 'now')  -- Verifica se o mês do aniversário é o mês atual
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getHistoricoComprasCliente(db: Database, cliente_id: number): Promise<any[]> {
  const query = `
    SELECT
      v.id,
      v.data,
      v.valor_total,
      v.metodo_pagamento,
      v.status,
      GROUP_CONCAT(
        CASE
          WHEN vi.produto_id IS NOT NULL THEN p.nome || ' (x' || vi.quantidade || ')'
          WHEN vi.servico_id IS NOT NULL THEN s.nome || ' (x' || vi.quantidade || ')'
        END
      ) as itens
    FROM vendas v
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    LEFT JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN servicos s ON vi.servico_id = s.id
    WHERE v.cliente_id = ?
    GROUP BY v.id
    ORDER BY v.data DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [cliente_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}



