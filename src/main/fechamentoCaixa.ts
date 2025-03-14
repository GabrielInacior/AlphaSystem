import { Database } from 'sqlite3';

// Função para calcular o intervalo de datas com base no período
function calcularPeriodo(periodo: string) {
  const hoje = new Date();
  let dataInicio = new Date();
  let dataFim = hoje;

  switch (periodo) {
    case 'dia':
      dataInicio.setHours(0, 0, 0, 0);
      dataFim.setHours(23, 59, 59, 999);
      break;
    case 'semana':
      const diaDaSemana = hoje.getDay();
      const primeiroDiaDaSemana = new Date(hoje);
      primeiroDiaDaSemana.setDate(hoje.getDate() - diaDaSemana);
      primeiroDiaDaSemana.setHours(0, 0, 0, 0);
      dataInicio = primeiroDiaDaSemana;
      break;
    case 'mes':
      dataInicio.setMonth(hoje.getMonth(), 1);
      dataInicio.setHours(0, 0, 0, 0);
      dataFim.setMonth(hoje.getMonth() + 1, 0);
      dataFim.setHours(23, 59, 59, 999);
      break;
    case 'ano':
      dataInicio.setMonth(0, 1);
      dataInicio.setHours(0, 0, 0, 0);
      dataFim.setMonth(11, 31);
      dataFim.setHours(23, 59, 59, 999);
      break;
    case 'todos':  // Caso "Todos", sem limite de data
      dataInicio = new Date(1970, 0, 1);  // Data de início: 1º de janeiro de 1970
      dataFim = hoje;  // Data final: data atual
      break;
    default:
      throw new Error('Período inválido');
  }

  // Retorna as datas no formato YYYY-MM-DD
  return {
    dataInicio: dataInicio.toISOString().split('T')[0],
    dataFim: dataFim.toISOString().split('T')[0]
  };
}

// Função para retornar as vendas de serviços por data
// Função para retornar as vendas de serviços por data
export function getVendasServicosPorData(
  db: Database,
  periodo: string // "dia", "semana", "mes", "ano", "todos"
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  let formatStr = '';
  let groupBy = '';
  switch (periodo) {
    case 'dia':
      formatStr = '%Y-%m-%d %H';
      groupBy = 'strftime("%Y-%m-%d %H", v.data)';
      break;
    case 'semana':
      formatStr = '%Y-%m-%d';
      groupBy = 'strftime("%w", v.data)';
      break;
    case 'mes':
      formatStr = '%Y-%m';
      groupBy = 'strftime("%Y-%m", v.data)';
      break;
    case 'ano':
      formatStr = '%Y';
      groupBy = 'strftime("%Y", v.data)';
      break;
    case 'todos': // Para o caso 'todos', vamos agrupar por ano para facilitar a análise global
      formatStr = '%Y';
      groupBy = 'strftime("%Y", v.data)';
      break;
    default:
      throw new Error('Período inválido');
  }

  const query = `
    SELECT ${groupBy} AS periodo,
           s.nome AS servico_nome,
           SUM(vi.quantidade) AS quantidade_vendida,
           SUM(vi.valor_total) AS total_vendido
    FROM vendas_itens vi
    JOIN servicos s ON vi.servico_id = s.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
    GROUP BY periodo, s.id
    ORDER BY periodo ASC, total_vendido DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dataInicio, dataFim], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getVendasProdutosPorData(
  db: Database,
  periodo: string
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  let formatStr = '';
  let groupBy = '';
  switch (periodo) {
    case 'dia':
      formatStr = '%Y-%m-%d %H';
      groupBy = 'strftime("%Y-%m-%d %H", v.data)';
      break;
    case 'semana':
      formatStr = '%Y-%m-%d';
      groupBy = 'strftime("%w", v.data)';
      break;
    case 'mes':
      formatStr = '%Y-%m';
      groupBy = 'strftime("%Y-%m", v.data)';
      break;
    case 'ano':
      formatStr = '%Y';
      groupBy = 'strftime("%Y", v.data)';
      break;
    case 'todos':
      formatStr = '%Y';
      groupBy = 'strftime("%Y", v.data)';
      break;
    default:
      throw new Error('Período inválido');
  }

  const query = `
    SELECT ${groupBy} AS periodo,
           SUM(vi.quantidade) AS quantidade_total_vendida,
           SUM(vi.valor_total) AS total_vendido
    FROM vendas_itens vi
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
      AND vi.produto_id IS NOT NULL
    GROUP BY periodo
    ORDER BY periodo ASC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dataInicio, dataFim], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Função para retornar os melhores clientes (maiores compras)
export function getMelhoresClientes(
  db: Database,
  limite: number // Número máximo de clientes a retornar
): Promise<any[]> {
  const query = `
    SELECT c.nome AS cliente_nome, SUM(v.valor_total) AS total_comprado
    FROM vendas v
    JOIN clientes c ON v.cliente_id = c.id
    GROUP BY c.id
    ORDER BY total_comprado DESC
    LIMIT ?
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [limite], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Função para retornar os produtos mais vendidos
export function getProdutosMaisVendidos(
  db: Database,
  periodo: string // "dia", "semana", "mes", "ano"
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT p.nome AS produto_nome, SUM(vi.quantidade) AS quantidade_vendida, SUM(vi.valor_total) AS total_vendido
    FROM vendas_itens vi
    JOIN produtos p ON vi.produto_id = p.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
    GROUP BY p.id
    ORDER BY total_vendido DESC
    LIMIT 5
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dataInicio, dataFim], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Função para retornar os serviços mais vendidos
export function getServicosMaisVendidos(
  db: Database,
  periodo: string // "dia", "semana", "mes", "ano"
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT s.nome AS servico_nome, SUM(vi.quantidade) AS quantidade_vendida, SUM(vi.valor_total) AS total_vendido
    FROM vendas_itens vi
    JOIN servicos s ON vi.servico_id = s.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
    GROUP BY s.id
    ORDER BY total_vendido DESC
     LIMIT 5
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dataInicio, dataFim], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Função para retornar o lucro total da loja (Produtos vendidos - Custo)
export function getLucroTotalLoja(
  db: Database,
  periodo: string
): Promise<any> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT SUM(vi.valor_total) AS total_vendido, SUM(p.custo * vi.quantidade) AS total_custo,
           SUM(vi.valor_total) - SUM(p.custo * vi.quantidade) AS lucro_total
    FROM vendas_itens vi
    JOIN produtos p ON vi.produto_id = p.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [dataInicio, dataFim], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Função para retornar o lucro total (Produtos + Serviços - Despesas - Custo de Produto)
export function getLucroTotal(
  db: Database,
  periodo: string
): Promise<any> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT
      SUM(vi.valor_total) AS total_produtos_vendidos,
      SUM(si.valor_total) AS total_servicos_vendidos,
      SUM(p.custo * vi.quantidade) AS total_custo_produtos,
      SUM(d.valor) AS total_despesas,
      (SUM(vi.valor_total) + SUM(si.valor_total)) - (SUM(p.custo * vi.quantidade) + SUM(d.valor)) AS lucro_total
    FROM vendas_itens vi
    LEFT JOIN servicos si ON vi.servico_id = si.id
    LEFT JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN vendas v ON vi.venda_id = v.id
    LEFT JOIN despesas d ON v.data = d.data
    WHERE v.data BETWEEN ? AND ?
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [dataInicio, dataFim], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Função para retornar as vendas por método de pagamento
export function getVendasPorMetodoPagamento(
  db: Database,
  periodo: string // "dia", "semana", "mes", "ano"
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT p.metodo_pagamento, SUM(v.valor_total) AS total_vendido
    FROM vendas v
    WHERE v.data BETWEEN ? AND ?
    GROUP BY p.metodo_pagamento
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dataInicio, dataFim], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getDespesasPorTipo(
  db: Database,
  periodo: string,
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);
  let query = `
    SELECT d.tipo, SUM(d.valor) AS total_despesas
    FROM despesas d
    WHERE d.data BETWEEN ? AND ?
    GROUP BY d.tipo
    ORDER BY total_despesas DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dataInicio, dataFim], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getVendasPorCliente(
  db: Database,
  periodo: string, // "dia", "semana", "mes", "ano"
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);
  let query = `
    SELECT c.nome AS cliente_nome,
           SUM(vi.valor_total) AS total_gasto_produtos,
           SUM(si.valor_total) AS total_gasto_servicos
    FROM vendas v
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    LEFT JOIN servicos si ON vi.servico_id = si.id
    JOIN clientes c ON v.cliente_id = c.id
    WHERE v.data BETWEEN ? AND ?
    GROUP BY c.id
    ORDER BY total_gasto_produtos DESC, total_gasto_servicos DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dataInicio, dataFim], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getVendasProdutosVsServicos(
  db: Database,
  periodo: string, // "dia", "semana", "mes", "ano"
): Promise<any> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);
  let query = `
    SELECT
      SUM(vi.valor_total) AS total_produtos_vendidos,
      SUM(si.valor_total) AS total_servicos_vendidos
    FROM vendas_itens vi
    LEFT JOIN servicos si ON vi.servico_id = si.id
    LEFT JOIN produtos p ON vi.produto_id = p.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [dataInicio, dataFim], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getCustoVsLucro(
  db: Database,
  periodo: string, // "dia", "semana", "mes", "ano"
): Promise<any> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);
  const query = `
    SELECT
      SUM(p.custo * vi.quantidade) AS total_custo_produtos,
      SUM(vi.valor_total) - SUM(p.custo * vi.quantidade) AS lucro_produtos
    FROM vendas_itens vi
    JOIN produtos p ON vi.produto_id = p.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [dataInicio, dataFim], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Função para retornar os clientes que mais compraram produtos
export function getClientesMaisCompraramProdutos(
  db: Database,
  periodo: string, // "dia", "semana", "mes", "ano"
  limite: number // Número máximo de clientes a retornar
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT c.nome AS cliente_nome,
           SUM(vi.valor_total) AS total_comprado_produtos,
           SUM(vi.quantidade) AS quantidade_produtos_comprados
    FROM vendas v
    JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    LEFT JOIN produtos p ON vi.produto_id = p.id
    WHERE v.data BETWEEN ? AND ? AND vi.produto_id IS NOT NULL
    GROUP BY c.id
    ORDER BY total_comprado_produtos DESC
    LIMIT ?
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dataInicio, dataFim, limite], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getVendasProdutosPorMetodoPagamento(
  db: Database,
  periodo: string
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT v.metodo_pagamento AS metodo,
           SUM(vi.valor_total) AS total_vendas
    FROM vendas v
    JOIN vendas_itens vi ON v.id = vi.venda_id
    WHERE v.data BETWEEN ? AND ?
      AND vi.produto_id IS NOT NULL
    GROUP BY v.metodo_pagamento
    ORDER BY total_vendas DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dataInicio, dataFim], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getProdutosSemEstoque(db: Database): Promise<any[]> {
  const query = `
    SELECT id, nome, qtdEstoque
    FROM produtos
    WHERE qtdEstoque = 0
    ORDER BY nome ASC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getQuantidadeEReceitaProdutos(db: Database): Promise<any> {
  const query = `
    SELECT
      SUM(vi.quantidade) AS total_produtos_vendidos,
      SUM(vi.valor_total) AS receita_total_produtos
    FROM vendas_itens vi
    WHERE vi.produto_id IS NOT NULL
  `;

  return new Promise((resolve, reject) => {
    db.get(query, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}







