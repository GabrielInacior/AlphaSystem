import { Database } from 'sqlite3';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { fromZonedTime, toDate } from 'date-fns-tz'; // Importando as funções corretas

// Função para calcular o intervalo de datas com base no período
function calcularPeriodo(periodo: string) {
  const timeZone = 'America/Sao_Paulo'; // Definindo o fuso horário

  // Obter a data e hora atual no fuso horário desejado
  const agora = new Date();
  const hoje = fromZonedTime(agora, timeZone); // Converte a data para o fuso horário específico

  let dataInicio = new Date();
  let dataFim = new Date(hoje);

  switch (periodo) {
    case 'dia':
      // Definir início e fim do dia com o fuso horário ajustado
      dataInicio = startOfDay(hoje); // Início do dia (00:00)
      dataFim = endOfDay(hoje); // Fim do dia (23:59:59.999)
      break;
    case 'semana':
      dataInicio = subDays(hoje, 7); // 7 dias atrás
      dataFim = hoje; // Fim do dia de hoje
      break;
    case 'mes':
      dataInicio = subDays(hoje, 30); // 30 dias atrás
      dataFim = hoje; // Fim do dia de hoje
      break;
    case 'ano':
      dataInicio.setFullYear(hoje.getFullYear() - 1); // 1 ano atrás
      dataFim = hoje; // Fim do dia de hoje
      break;
    case 'todos':
      dataInicio = new Date(1970, 0, 1); // Data de início desde 1970
      dataFim = hoje; // Fim do dia de hoje
      break;
    default:
      throw new Error('Período inválido');
  }

  // Convertendo as datas para UTC, ajustadas para o fuso horário
  const dataInicioUTC = toDate(dataInicio); // Converte para UTC
  const dataFimUTC = toDate(dataFim); // Converte para UTC

  return {
    dataInicio: dataInicioUTC.toISOString(),
    dataFim: dataFimUTC.toISOString()
  };
}


// Função para retornar as vendas de serviços por data
export function getVendasServicosPorData(
  db: Database,
  periodo: string
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  let groupBy = '';

  switch (periodo) {
    case 'dia':
      groupBy = 'strftime("%Y-%m-%d %H:00:00", datetime(v.data))';
      break;
    case 'semana':
      groupBy = 'strftime("%Y-%m-%d", v.data)';
      break;
    case 'mes':
      groupBy = 'strftime("%Y-%m-%d", v.data)';
      break;
    case 'ano':
      groupBy = 'strftime("%Y-%m", v.data)';
      break;
    case 'todos':
      groupBy = 'strftime("%Y", v.data)';  // Agrupar por ano para "todos"
      break;
  }

  const query = `
    SELECT
      ${groupBy} AS periodo,
      s.nome AS servico_nome,
      SUM(vi.quantidade) AS quantidade_vendida,
      SUM(vi.valor_total) AS total_vendido
    FROM vendas_itens vi
    JOIN vendas v ON vi.venda_id = v.id
    JOIN servicos s ON vi.servico_id = s.id
    WHERE datetime(v.data) BETWEEN datetime(?) AND datetime(?)
      AND vi.servico_id IS NOT NULL
      AND vi.produto_id IS NULL
    GROUP BY periodo, s.id
    ORDER BY periodo ASC, servico_nome
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
  periodo: string,
  categoria_id?: number
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  let groupBy = '';
  let formatStr = '';
  switch (periodo) {
    case 'dia':
      groupBy = 'strftime("%Y-%m-%d %H:00:00", datetime(v.data))';
      break;
    case 'semana':
      groupBy = 'strftime("%Y-%m-%d", v.data)';
      break;
    case 'mes':
      groupBy = 'strftime("%Y-%m-%d", v.data)';
      break;
    case 'ano':
      groupBy = 'strftime("%Y-%m", v.data)';
      break;
    case 'todos':
      groupBy = 'strftime("%Y", v.data)';  // Agrupar por ano para "todos"
      break;
  }

  const query = `
    SELECT
      ${groupBy} AS periodo,
      c.nome AS categoria_nome,
      SUM(vi.quantidade) AS quantidade_total_vendida,
      SUM(vi.valor_total) AS total_vendido
    FROM vendas_itens vi
    JOIN vendas v ON vi.venda_id = v.id
    JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE datetime(v.data) BETWEEN datetime(?) AND datetime(?)
    AND vi.produto_id IS NOT NULL
    AND vi.servico_id IS NULL
    ${categoria_id ? 'AND p.categoria_id = ?' : ''}
    GROUP BY periodo, c.id
    ORDER BY periodo ASC, categoria_nome
  `;

  const params = categoria_id ? [dataInicio, dataFim, categoria_id] : [dataInicio, dataFim];

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
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
  periodo: string,
  categoria_id?: number
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT
      p.nome AS produto_nome,
      c.nome AS categoria_nome,
      c.id AS categoria_id,
      SUM(vi.quantidade) AS quantidade_vendida,
      SUM(vi.valor_total) AS total_vendido
    FROM vendas_itens vi
    JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN categorias c ON p.categoria_id = c.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
    ${categoria_id ? 'AND p.categoria_id = ?' : ''}
    GROUP BY p.id
    ORDER BY quantidade_vendida DESC
    LIMIT 50
  `;

  const params = categoria_id ? [dataInicio, dataFim, categoria_id] : [dataInicio, dataFim];

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
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
    ORDER BY quantidade_vendida DESC
     LIMIT 50
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
    SELECT
      SUM(vi.valor_total) AS total_vendido,
      SUM(COALESCE(p.custo, 0) * vi.quantidade) AS total_custo,
      SUM(vi.valor_total) - SUM(COALESCE(p.custo, 0) * vi.quantidade) AS lucro_total
    FROM vendas_itens vi
    JOIN produtos p ON vi.produto_id = p.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
    AND vi.produto_id IS NOT NULL
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [dataInicio, dataFim], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getClientesComVendasPendentes(db: Database): Promise<any> {
  const query = `
    SELECT
      c.id AS cliente_id,
      c.nome AS cliente_nome,
      c.telefone AS cliente_telefone,
      SUM(vi.valor_total) - SUM(v.valor_pago) AS total_devido
    FROM vendas v
    JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    WHERE v.status = 'pendente'
    GROUP BY c.id
    ORDER BY total_devido DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
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
      -- Quantidade e valor total de produtos vendidos
      SUM(CASE WHEN vi.produto_id IS NOT NULL THEN vi.quantidade ELSE 0 END) AS qtd_produtos_vendidos,
      SUM(CASE WHEN vi.produto_id IS NOT NULL THEN vi.valor_total ELSE 0 END) AS total_produtos_vendidos,

      -- Quantidade e valor total de serviços vendidos
      SUM(CASE WHEN vi.servico_id IS NOT NULL THEN vi.quantidade ELSE 0 END) AS qtd_servicos_vendidos,
      SUM(CASE WHEN vi.servico_id IS NOT NULL THEN vi.valor_total ELSE 0 END) AS total_servicos_vendidos,

      -- Custo total dos produtos vendidos
      SUM(CASE WHEN vi.produto_id IS NOT NULL THEN (p.custo * vi.quantidade) ELSE 0 END) AS total_custo_produtos,

      -- Total de despesas no período
      (SELECT COUNT(*) FROM despesas d WHERE d.data BETWEEN ? AND ?) AS qtd_despesas,
      (SELECT IFNULL(SUM(d.valor), 0) FROM despesas d WHERE d.data BETWEEN ? AND ?) AS total_despesas,

      -- Lucro total = (produtos vendidos - custo produtos) + serviços vendidos - despesas
      (
        (SUM(CASE WHEN vi.produto_id IS NOT NULL THEN vi.valor_total ELSE 0 END) -
         SUM(CASE WHEN vi.produto_id IS NOT NULL THEN (p.custo * vi.quantidade) ELSE 0 END)
        ) + SUM(CASE WHEN vi.servico_id IS NOT NULL THEN vi.valor_total ELSE 0 END)
        - (SELECT IFNULL(SUM(d.valor), 0) FROM despesas d WHERE d.data BETWEEN ? AND ?)
      ) AS lucro_total
    FROM vendas_itens vi
    LEFT JOIN produtos p ON vi.produto_id = p.id
    LEFT JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
  `;

  const params = [
    dataInicio, dataFim, // qtd_despesas
    dataInicio, dataFim, // total_despesas
    dataInicio, dataFim, // lucro_total -> despesas
    dataInicio, dataFim  // where principal
  ];

  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
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
  periodo: string // "dia", "semana", "mes", "ano"
): Promise<any> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  let query = `
    SELECT
      SUM(CASE WHEN vi.produto_id IS NOT NULL THEN vi.valor_total ELSE 0 END) AS total_produtos_vendidos,
      SUM(CASE WHEN vi.servico_id IS NOT NULL THEN vi.valor_total ELSE 0 END) AS total_servicos_vendidos
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
  periodo: string,
  categoria_id?: number
): Promise<any> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT
      SUM(vi.valor_total) AS total_bruto_produtos,
      SUM(p.custo * vi.quantidade) AS total_custo_produtos,
      SUM(vi.valor_total) - SUM(p.custo * vi.quantidade) AS lucro_produtos
    FROM vendas_itens vi
    JOIN produtos p ON vi.produto_id = p.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
    AND p.id IS NOT NULL
    ${categoria_id ? 'AND p.categoria_id = ?' : ''}
  `;

  const params = categoria_id ? [dataInicio, dataFim, categoria_id] : [dataInicio, dataFim];

  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}


// Função para retornar os clientes que mais compraram produtos
export function getClientesMaisCompraramProdutos(
  db: Database,
  periodo: string,
  limite: number,
  categoria_id?: number
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT
      c.nome AS cliente_nome,
      COUNT(DISTINCT vi.venda_id) AS quantidade_compras,
      SUM(vi.quantidade) AS quantidade_produtos_comprados,
      SUM(vi.valor_total) AS total_gasto
    FROM vendas v
    JOIN vendas_itens vi ON v.id = vi.venda_id
    JOIN produtos p ON vi.produto_id = p.id
    JOIN clientes c ON v.cliente_id = c.id
    WHERE v.data BETWEEN ? AND ?
      AND vi.produto_id IS NOT NULL
      ${categoria_id ? 'AND p.categoria_id = ?' : ''}
    GROUP BY c.id
    ORDER BY total_gasto DESC
    LIMIT ?
  `;

  const params = categoria_id ? [dataInicio, dataFim, categoria_id, limite] : [dataInicio, dataFim, limite];

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getClientesMaisCompraramServicos(
  db: Database,
  periodo: string, // "dia", "semana", "mes", "ano"
  limite: number // Número máximo de clientes a retornar
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT c.nome AS cliente_nome,
           SUM(vi.valor_total) AS total_comprado_servicos,
           SUM(vi.quantidade) AS quantidade_servicos_comprados
    FROM vendas v
    JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN vendas_itens vi ON v.id = vi.venda_id
    LEFT JOIN servicos s ON vi.servico_id = s.id
    WHERE v.data BETWEEN ? AND ? AND vi.produto_id IS NULL
    GROUP BY c.id
    ORDER BY total_comprado_servicos DESC
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
  periodo: string,
  categoria_id?: number
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT v.metodo_pagamento AS metodo,
           SUM(vi.valor_total) AS total_vendas
    FROM vendas v
    JOIN vendas_itens vi ON v.id = vi.venda_id
    JOIN produtos p ON vi.produto_id = p.id
    WHERE v.data BETWEEN ? AND ?
      AND vi.produto_id IS NOT NULL
      ${categoria_id ? 'AND p.categoria_id = ?' : ''}
    GROUP BY v.metodo_pagamento
    ORDER BY total_vendas DESC
  `;

  const params = categoria_id ? [dataInicio, dataFim, categoria_id] : [dataInicio, dataFim];

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getVendasServicosPorMetodoPagamento(
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
      AND vi.produto_id IS NULL
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
     JOIN vendas v ON vi.venda_id = v.id
    WHERE vi.produto_id IS NOT NULL
    AND vi.servico_id IS NULL
  `;

  return new Promise((resolve, reject) => {
    db.get(query, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getQuantidadeEReceitaServicos(
  db: Database,
  periodo: string
): Promise<any> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
     SELECT
      SUM(vi.quantidade) AS total_servicos_vendidos,
      SUM(vi.valor_total) AS receita_total_servicos
    FROM vendas_itens vi
     JOIN vendas v ON vi.venda_id = v.id
     WHERE v.data BETWEEN ? AND ?
     AND vi.produto_id IS NULL
     AND vi.servico_id IS NOT NULL
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [dataInicio, dataFim], (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0]);
    });
  });
}

export function getQuantidadeEReceitaServicosTOTAL(db: Database): Promise<any> {
  const query = `
    SELECT
      SUM(vi.quantidade) AS total_servicos_vendidos,
      SUM(vi.valor_total) AS receita_total_servicos
    FROM vendas_itens vi
     JOIN vendas v ON vi.venda_id = v.id
    WHERE vi.produto_id IS NULL
     AND vi.servico_id IS NOT NULL
  `;

  return new Promise((resolve, reject) => {
    db.get(query, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Função para retornar os produtos mais vendidos por categoria
export function getProdutosMaisVendidosPorCategoria(
  db: Database,
  periodo: string,
  categoria_id?: number
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT
      c.nome AS categoria_nome,
      p.nome AS produto_nome,
      p.categoria_id,
      SUM(vi.quantidade) AS quantidade_vendida,
      SUM(vi.valor_total) AS total_vendido
    FROM vendas_itens vi
    JOIN produtos p ON vi.produto_id = p.id
    JOIN categorias c ON p.categoria_id = c.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
    ${categoria_id ? 'AND p.categoria_id = ?' : ''}
    GROUP BY c.id, p.id
    ORDER BY c.nome, quantidade_vendida DESC
  `;

  const params = categoria_id ? [dataInicio, dataFim, categoria_id] : [dataInicio, dataFim];

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Função para retornar o lucro total por categoria
export function getLucroTotalPorCategoria(
  db: Database,
  periodo: string,
  categoria_id?: number
): Promise<any[]> {
  const { dataInicio, dataFim } = calcularPeriodo(periodo);

  const query = `
    SELECT
      c.nome AS categoria_nome,
      c.id AS categoria_id,
      SUM(vi.valor_total) AS total_vendido,
      SUM(COALESCE(p.custo, 0) * vi.quantidade) AS total_custo,
      SUM(vi.valor_total) - SUM(COALESCE(p.custo, 0) * vi.quantidade) AS lucro_total
    FROM vendas_itens vi
    JOIN produtos p ON vi.produto_id = p.id
    JOIN categorias c ON p.categoria_id = c.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data BETWEEN ? AND ?
    AND vi.produto_id IS NOT NULL
    ${categoria_id ? 'AND p.categoria_id = ?' : ''}
    GROUP BY c.id
    ORDER BY lucro_total DESC
  `;

  const params = categoria_id ? [dataInicio, dataFim, categoria_id] : [dataInicio, dataFim];

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getClientesAtendidosHoje(db: Database): Promise<any> {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const query = `
    SELECT COUNT(DISTINCT v.cliente_id) as total_clientes
    FROM vendas v
    JOIN vendas_itens vi ON v.id = vi.venda_id
    WHERE v.data >= ? AND v.data < ?
    AND vi.servico_id IS NOT NULL
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [hoje.toISOString(), amanha.toISOString()], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getValorAtendimentosHoje(db: Database): Promise<any> {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const query = `
    SELECT SUM(vi.valor_total) as valor_total
    FROM vendas v
    JOIN vendas_itens vi ON v.id = vi.venda_id
    WHERE v.data >= ? AND v.data < ?
    AND vi.servico_id IS NOT NULL
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [hoje.toISOString(), amanha.toISOString()], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getServicoMaisVendidoHoje(db: Database): Promise<any> {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const query = `
    SELECT
      s.nome AS servico_nome,
      COUNT(*) AS quantidade_vendida,
      SUM(vi.valor_total) AS total_vendido
    FROM vendas_itens vi
    JOIN servicos s ON vi.servico_id = s.id
    JOIN vendas v ON vi.venda_id = v.id
    WHERE v.data >= ? AND v.data < ?
      AND vi.servico_id IS NOT NULL
    GROUP BY s.id, s.nome
    ORDER BY quantidade_vendida DESC
    LIMIT 1
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [hoje.toISOString(), amanha.toISOString()], (err, row) => {
      if (err) reject(err);
      else resolve(row || { servico_nome: 'Nenhum serviço', quantidade_vendida: 0, total_vendido: 0 });
    });
  });
}







