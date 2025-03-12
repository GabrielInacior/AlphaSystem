import { Database } from 'sqlite3';

// Obter todas as vendas
export function getTodasVendas(db: Database): Promise<any[]> {
  const query = `
    SELECT v.id, v.cliente_id, v.valor_total, v.valor_pago, v.metodo_pagamento, v.status, v.data,
           c.nome AS nome_cliente,
           p.nome AS produto_nome, p.preco AS produto_preco,
           s.nome AS servico_nome, s.preco AS servico_preco
    FROM vendas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    LEFT JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN servicos s ON vi.servico_id = s.id
     ORDER BY v.data DESC
  `;
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Obter vendas pagas
export function getVendasPagas(db: Database): Promise<any[]> {
  const query = `
    SELECT v.id, v.cliente_id, v.valor_total, v.valor_pago, v.metodo_pagamento, v.status, v.data,
           c.nome AS nome_cliente,
           vi.produto_id, vi.servico_id, vi.quantidade, vi.valor_unitario, vi.valor_total AS item_valor_total,
           p.nome AS produto_nome, p.preco AS produto_preco,
           s.nome AS servico_nome, s.preco AS servico_preco
    FROM vendas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    LEFT JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN servicos s ON vi.servico_id = s.id
    WHERE v.status = 'pago'
    ORDER BY v.data DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows: unknown[]) => {
      if (err) reject(err);
      else {
        // Garantir que cada 'row' tenha o tipo correto
        const vendasMap = new Map();

       rows.forEach((row: any)  => {  // Use 'row: any' ou 'row as VendaEntity' se souber a estrutura de antemão
          const vendaId = row.id;

          if (!vendasMap.has(vendaId)) {
            vendasMap.set(vendaId, {
              id: vendaId,
              cliente_id: row.cliente_id,
              nome_cliente: row.nome_cliente,
              valor_total: row.valor_total,
              valor_pago: row.valor_pago,
              metodo_pagamento: row.metodo_pagamento,
              status: row.status,
              data: row.data,
              itens: []
            });
          }

          const venda = vendasMap.get(vendaId);
          venda.itens.push({
            produto_id: row.produto_id,
            servico_id: row.servico_id,
            nome_item: row.produto_nome || row.servico_nome,
            valor_unitario: row.produto_preco || row.servico_preco,
            quantidade: row.quantidade,
            valor_total: row.item_valor_total
          });
        });

        resolve(Array.from(vendasMap.values()));
      }
    });
  });
}

// Obter vendas fiado (não pagas)
export function getVendasFiado(db: Database): Promise<any[]> {
  const query = `
    SELECT v.id, v.cliente_id, v.valor_total, v.valor_pago, v.metodo_pagamento, v.status, v.data,
           c.nome AS nome_cliente,
           vi.produto_id, vi.servico_id, vi.quantidade, vi.valor_unitario, vi.valor_total AS item_valor_total,
           p.nome AS produto_nome, p.preco AS produto_preco,
           s.nome AS servico_nome, s.preco AS servico_preco
    FROM vendas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    LEFT JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN servicos s ON vi.servico_id = s.id
    WHERE v.status = 'pendente'
    ORDER BY v.data DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else {
        // Agrupar os itens por venda
        const vendasMap = new Map();

        rows.forEach((row: any) =>{
          const vendaId = row.id;

          // Se a venda ainda não está no mapa, inicializamos ela
          if (!vendasMap.has(vendaId)) {
            vendasMap.set(vendaId, {
              id: vendaId,
              cliente_id: row.cliente_id,
              nome_cliente: row.nome_cliente,
              valor_total: row.valor_total,
              valor_pago: row.valor_pago,
              metodo_pagamento: row.metodo_pagamento,
              status: row.status,
              data: row.data,
              itens: []
            });
          }

          // Adicionar item à venda com nome do produto ou serviço
          const venda = vendasMap.get(vendaId);
          venda.itens.push({
            produto_id: row.produto_id,
            servico_id: row.servico_id,
            nome_item: row.produto_nome || row.servico_nome, // Nome do produto ou serviço
            valor_unitario: row.produto_preco || row.servico_preco, // Preço do produto ou serviço
            quantidade: row.quantidade,
            valor_total: row.item_valor_total
          });
        });

        // Converter o Map em um array e retornar as vendas
        resolve(Array.from(vendasMap.values()));
      }
    });
  });
}

// Obter todos os itens vendidos
export function getItensVendidos(db: Database): Promise<any[]> {
  const query = `
    SELECT vi.id, vi.venda_id, vi.produto_id, vi.servico_id, vi.quantidade, vi.valor_unitario, vi.valor_total AS item_valor_total,
           p.nome AS produto_nome, p.preco AS produto_preco,
           s.nome AS servico_nome, s.preco AS servico_preco
    FROM vendas_itens vi
    LEFT JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN servicos s ON vi.servico_id = s.id
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else {
        // Agrupar os itens por venda
        const itensMap = new Map();

        rows.forEach((row: any) => {
          const vendaId = row.venda_id;

          // Se a venda ainda não está no mapa, inicializamos ela
          if (!itensMap.has(vendaId)) {
            itensMap.set(vendaId, []);
          }

          // Adicionar item à venda
          itensMap.get(vendaId).push({
            produto_id: row.produto_id,
            servico_id: row.servico_id,
            nome_item: row.produto_nome || row.servico_nome,
            valor_unitario: row.produto_preco || row.servico_preco,
            quantidade: row.quantidade,
            valor_total: row.item_valor_total
          });
        });

        // Converter o Map em um array
        resolve(Array.from(itensMap.values()).flat());
      }
    });
  });
}

// Criar venda
export function createVenda(db: Database, cliente_id: number, valor_total: number, metodo_pagamento: string, status: string, data: string, itens: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const queryVenda = `INSERT INTO vendas (cliente_id, valor_total, valor_pago, metodo_pagamento, status, data) VALUES (?, ?, 0, ?, ?, ?)`;
      db.run(queryVenda, [cliente_id, valor_total, metodo_pagamento, status, data], function (err) {
        if (err) {
          console.error('Erro ao criar venda:', err.message);
          return reject(err);
        } else {
          const venda_id = this.lastID;
          itens.forEach(item => {
            const queryItem = `INSERT INTO vendas_itens (venda_id, produto_id, servico_id, quantidade, valor_unitario, valor_total) VALUES (?, ?, ?, ?, ?, ?)`;
            db.run(queryItem, [venda_id, item.produto_id, item.servico_id, item.quantidade, item.valor_unitario, item.valor_total], (err) => {
              if (err) {
                console.error('Erro ao adicionar item na venda:', err.message);
              }
            });
          });
          console.log(`Venda criada com sucesso, ID: ${venda_id}`);
          resolve({ id: venda_id });
        }
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}


export function getTotalVendasPorTipo(db: Database, tipo: string): Promise<any> {
  const condicao = tipo === "servico" ? "vi.servico_id IS NOT NULL" : "vi.produto_id IS NOT NULL";
  const query = `
    SELECT SUM(v.valor_total) AS total
    FROM vendas v
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    WHERE ${condicao}
  `;
  return new Promise((resolve, reject) => {
    db.get(query, [], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getTotalVendasPorPeriodo(db: Database, tipo: string, periodo: string): Promise<any> {
  let condicaoData = "";
  const condicaoTipo = tipo === "servico" ? "vi.servico_id IS NOT NULL" : "vi.produto_id IS NOT NULL";

  if (periodo === "dia") {
    condicaoData = "strftime('%Y-%m-%d', v.data) = strftime('%Y-%m-%d', 'now')";
  } else if (periodo === "mes") {
    condicaoData = "strftime('%Y-%m', v.data) = strftime('%Y-%m', 'now')";
  } else if (periodo === "ano") {
    condicaoData = "strftime('%Y', v.data) = strftime('%Y', 'now')";
  }

  const query = `
    SELECT SUM(v.valor_total) AS total
    FROM vendas v
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    WHERE ${condicaoTipo} AND ${condicaoData}
    ORDER BY v.data DESC
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}


export function getVendaById(db: Database, venda_id: number): Promise<any> {
  const query = `
    SELECT v.id, v.cliente_id, v.valor_total, v.valor_pago, v.metodo_pagamento, v.status, v.data,
           c.nome AS cliente_nome,
           p.nome AS produto_nome, p.preco AS produto_preco,
           s.nome AS servico_nome, s.preco AS servico_preco
    FROM vendas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    LEFT JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN servicos s ON vi.servico_id = s.id
    WHERE v.id = ?
  `;
  return new Promise((resolve, reject) => {
    db.get(query, [venda_id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getVendasPorData(db: Database, data: string): Promise<any[]> {
  const query = `
    SELECT v.id, v.cliente_id, v.valor_total, v.valor_pago, v.metodo_pagamento, v.status, v.data,
           c.nome AS cliente_nome,
           p.nome AS produto_nome, p.preco AS produto_preco,
           s.nome AS servico_nome, s.preco AS servico_preco
    FROM vendas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    LEFT JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN servicos s ON vi.servico_id = s.id
    WHERE v.data = ?
    ORDER BY v.data DESC
  `;
  return new Promise((resolve, reject) => {
    db.all(query, [data], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}


export function updateVenda(db: Database, venda_id: number, valor_pago: number, metodo_pagamento: string, status: string): void {
  const query = `UPDATE vendas SET valor_pago = ?, metodo_pagamento = ?, status = ? WHERE id = ?`;
  db.run(query, [valor_pago, metodo_pagamento, status, venda_id], function (err) {
    if (err) {
      console.error('Erro ao atualizar venda:', err.message);
    } else {
      console.log(`Venda ID ${venda_id} atualizada com sucesso`);
    }
  });
}

// Deletar venda
export function deleteVenda(db: Database, venda_id: number): void {
  const query = `DELETE FROM vendas WHERE id = ?`;
  db.run(query, [venda_id], function (err) {
    if (err) {
      console.error('Erro ao deletar venda:', err.message);
    } else {
      console.log(`Venda ID ${venda_id} deletada com sucesso`);
    }
  });
}


