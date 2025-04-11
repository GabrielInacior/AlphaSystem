export interface Api {
  // Métodos gerais
  closeWindow: () => void;

  // Métodos para clientes
  createCliente: (nome: string, aniversario: string, telefone: string) => Promise<void>;
  getAllClientes: () => Promise<any[]>;
  getClienteById: (id: number) => Promise<any>;
  getClientesAniversariantes: () => Promise<any[]>;
  updateCliente: (id: number, nome: string, aniversario: string, telefone: string) => Promise<void>;
  deleteCliente: (id: number) => Promise<void>;

  // Métodos para serviços
  createServico: (nome: string, preco: number) => Promise<void>;
  getAllServicos: () => Promise<any[]>;
  getServicoById: (id: number) => Promise<any>;
  updateServico: (id: number, nome: string, preco: number) => Promise<void>;
  deleteServico: (id: number) => Promise<void>;

  // Métodos para produtos
  createProduto: (nome: string, custo: number, preco: number, qtdEstoque: number, categoria_id: number) => Promise<void>;
  getAllProdutos: () => Promise<any[]>;
  getProdutoById: (id: number) => Promise<any>;
  updateProduto: (id: number, nome: string, custo: number, preco: number, qtdEstoque: number, categoria_id: number) => Promise<void>;
  deleteProduto: (id: number) => Promise<void>;
  atualizarEstoqueProduto: (id: number, quantidadeVendida: number) => Promise<void>;

  // Métodos para categorias
  createCategoria: (nome: string, descricao: string) => Promise<number>;
  getAllCategorias: () => Promise<any[]>;
  getCategoriaById: (id: number) => Promise<any>;
  updateCategoria: (id: number, nome: string, descricao: string) => Promise<void>;
  deleteCategoria: (id: number) => Promise<void>;

  // Métodos para vendas
  createVenda: (cliente_id: number, valor_total: number, valor_pago: number, metodo_pagamento: string, status: string, data: string, itens: any[]) => Promise<void>;
  getTodasVendas: () => Promise<any[]>;
  getVendasPagas: () => Promise<any[]>;
  getVendasFiado: () => Promise<any[]>;
  getItensVendidos: () => Promise<any[]>;
  updateVenda: (id: number, valor_total: number, valor_pago: number, metodo_pagamento: string, status: string, data: string) => Promise<void>;
  deleteVenda: (id: number) => Promise<void>;
  getTotalVendasPorTipo: (tipo: string) => Promise<any>;
  getTotalVendasPorPeriodo: (tipo: string, periodo: string) => Promise<any>;
  getVendaById: (venda_id: number) => Promise<any>;
  getVendasPorData: (data: string) => Promise<any[]>;

  // Métodos para despesas
  createDespesa: (descricao: string, valor: number, data: string, tipo: string) => Promise<void>;
  getAllDespesas: () => Promise<any[]>;
  updateDespesa: (id: number, descricao: string, valor: number, data: string, tipo: string) => Promise<void>;
  deleteDespesa: (id: number) => Promise<void>;

  // Métodos para fechamento de caixa
  createFechamentoCaixa: (tipo: string, total_vendas: number, total_despesas: number, total_cartao: number, total_pix: number, total_dinheiro: number, total_banco: number, data: string) => Promise<void>;
  getFechamentoCaixaPorData: (tipo: string, data: string) => Promise<any>;
  getFechamentoCaixaPorTipo: (tipo: string) => Promise<any[]>;
  getFechamentoCaixaPorId: (id: number) => Promise<any>;
  updateFechamentoCaixa: (id: number, total_vendas: number, total_despesas: number, total_cartao: number, total_pix: number, total_dinheiro: number, total_banco: number, data: string) => Promise<void>;

  // Métodos para insights
  getVendasProdutosPorData: (periodo: string) => Promise<any[]>;
  getVendasServicosPorData: (periodo: string) => Promise<any[]>;
  getMelhoresClientes: (limite: number) => Promise<any[]>;
  getProdutosMaisVendidos: (periodo: string) => Promise<any[]>;
  getServicosMaisVendidos: (periodo: string) => Promise<any[]>;
  getLucroTotalLoja: (periodo: string) => Promise<any>;
  getLucroTotal: (periodo: string) => Promise<any>;
  getVendasPorMetodoPagamento: (periodo: string) => Promise<any[]>;
  getDespesasPorTipo: (periodo: string) => Promise<any[]>;
  getVendasPorCliente: (periodo: string) => Promise<any[]>;
  getVendasProdutosVsServicos: (periodo: string) => Promise<any>;
  getCustoVsLucro: (periodo: string) => Promise<any>;
  getClientesMaisCompraramProdutos: (periodo: string, limite: number) => Promise<any[]>;
  getClientesMaisCompraramServicos: (periodo: string, limite: number) => Promise<any[]>;
  getVendasProdutosPorMetodoPagamento: (periodo: string) => Promise<any[]>;
  getVendasServicosPorMetodoPagamento: (periodo: string) => Promise<any[]>;
  getProdutosSemEstoque: () => Promise<any[]>;
  getQuantidadeEReceitaProdutos: () => Promise<any>;
  getClientesComVendasPendentes: () => Promise<any>;
  getQuantidadeEReceitaServicos: (periodo: string) => Promise<any>;

  // Insights por categoria
  getProdutosMaisVendidosPorCategoria: (periodo: string) => Promise<any[]>;
  getLucroTotalPorCategoria: (periodo: string) => Promise<any[]>;
}

declare global {
  interface Window {
    api: Api;
  }
}
