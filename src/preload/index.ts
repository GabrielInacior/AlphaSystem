/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getClientesComVendasPendentes, getClientesMaisCompraramProdutos, getQuantidadeEReceitaProdutos } from '../main/fechamentoCaixa';
import { getClientesAniversariantes } from '../main/clientes';

// Custom APIs for renderer
const api = {
  closeWindow: () => ipcRenderer.send('close-window'),

  createCliente: (nome: string, aniversario: string, telefone: string) =>
    ipcRenderer.invoke('create-cliente', nome, aniversario, telefone),
  getAllClientes: () => ipcRenderer.invoke('get-all-clientes'),

  getClienteById: (id: number) => ipcRenderer.invoke('get-cliente-by-id', id),

  getClientesAniversariantes: () => ipcRenderer.invoke('get-clientes-aniversariantes'),

  updateCliente: (id: number, nome: string, aniversario: string, telefone: string) =>
    ipcRenderer.invoke('update-cliente', id, nome, aniversario, telefone),

  deleteCliente: (id: number) => ipcRenderer.invoke('delete-cliente', id),

  createServico: (nome: string, preco: number) =>
    ipcRenderer.invoke('create-servico', nome, preco),

  getAllServicos: () => ipcRenderer.invoke('get-all-servicos'),

  getServicoById: (id: number) => ipcRenderer.invoke('get-servico-by-id', id),

  updateServico: (id: number, nome: string, preco: number) =>
    ipcRenderer.invoke('update-servico', id, nome, preco),

  deleteServico: (id: number) => ipcRenderer.invoke('delete-servico', id),

  createProduto: (nome: string, custo: number, preco: number, qtdEstoque: number, categoria_id: number) =>
    ipcRenderer.invoke('create-produto', nome, custo, preco, qtdEstoque, categoria_id),

  getAllProdutos: () => ipcRenderer.invoke('get-all-produtos'),

  getProdutoById: (id: number) => ipcRenderer.invoke('get-produto-by-id', id),

  updateProduto: (id: number, nome: string, custo: number, preco: number, qtdEstoque: number, categoria_id: number) =>
    ipcRenderer.invoke('update-produto', id, nome, custo, preco, qtdEstoque, categoria_id),

  deleteProduto: (id: number) => ipcRenderer.invoke('delete-produto', id),

  atualizarEstoqueProduto: (id: number, quantidadeVendida: number) =>
    ipcRenderer.invoke('atualizar-estoque-produto', id, quantidadeVendida),

  createVenda: (cliente_id: number, valor_total: number, valor_pago: number, metodo_pagamento: string, status: string, data: string, itens: any[], desconto: number = 0) => {
    return ipcRenderer.invoke('create-venda', cliente_id, valor_total, valor_pago, metodo_pagamento, status, data, itens, desconto);
  },

  getTodasVendas: () =>
    ipcRenderer.invoke('get-all-vendas'),

  getVendasPagas: () =>
    ipcRenderer.invoke('get-vendas-pagas'),

  getVendasFiado: () =>
    ipcRenderer.invoke('get-vendas-fiado'),

  getItensVendidos: () =>
    ipcRenderer.invoke('get-itens-vendidos'),

  updateVenda: (id: number, valor_total:number, valor_pago: number, metodo_pagamento: string, status: string, data: string) =>
    ipcRenderer.invoke('update-venda', id, valor_total, valor_pago, metodo_pagamento, status, data),

  deleteVenda: (id: number) =>
    ipcRenderer.invoke('delete-venda', id),

  getTotalVendasPorTipo: (tipo: string) =>
    ipcRenderer.invoke('get-total-vendas-por-tipo', tipo),

  getTotalVendasPorPeriodo: (tipo: string, periodo: string) =>
    ipcRenderer.invoke('get-total-vendas-por-periodo', tipo, periodo),

  getVendaById: (venda_id: number) =>
    ipcRenderer.invoke('get-venda-by-id', venda_id),

  getVendasPorData: (data: string) =>
    ipcRenderer.invoke('get-vendas-por-data', data),

  createDespesa: (descricao: string, valor: number, data: string, tipo: string, origem: string) =>
    ipcRenderer.invoke('create-despesa', descricao, valor, data, tipo, origem),
  getAllDespesas: () => ipcRenderer.invoke('get-all-despesas'),

  updateDespesa: (id: number, descricao: string, valor: number, data: string, tipo: string, origem: string) =>
    ipcRenderer.invoke('update-despesa', id, descricao, valor, data, tipo, origem),

  deleteDespesa: (id: number) => ipcRenderer.invoke('delete-despesa', id),

  createFechamentoCaixa: (tipo: string, total_vendas: number, total_despesas: number, total_cartao: number, total_pix: number, total_dinheiro: number, total_banco: number, data: string) =>
    ipcRenderer.invoke('create-fechamento-caixa', tipo, total_vendas, total_despesas, total_cartao, total_pix, total_dinheiro, total_banco, data),

  getFechamentoCaixaPorData: (tipo: string, data: string) =>
    ipcRenderer.invoke('get-fechamento-caixa-por-data', tipo, data),

  getFechamentoCaixaPorTipo: (tipo: string) =>
    ipcRenderer.invoke('get-fechamento-caixa-por-tipo', tipo),

  getFechamentoCaixaPorId: (id: number) =>
    ipcRenderer.invoke('get-fechamento-caixa-por-id', id),

  updateFechamentoCaixa: (id: number, total_vendas: number, total_despesas: number, total_cartao: number, total_pix: number, total_dinheiro: number, total_banco: number, data: string) =>
    ipcRenderer.invoke('update-fechamento-caixa', id, total_vendas, total_despesas, total_cartao, total_pix, total_dinheiro, total_banco, data),

  //Apis de Insights
  getVendasProdutosPorData: (periodo: string, categoria_id?: number) =>
    ipcRenderer.invoke('get-vendas-produtos-por-data', periodo, categoria_id),

  getVendasServicosPorData: (periodo: string) =>
    ipcRenderer.invoke('get-vendas-servicos-por-data', periodo),

  // Função para obter os melhores clientes
  getMelhoresClientes: (limite: number) =>
    ipcRenderer.invoke('get-melhores-clientes', limite),

  // Função para obter os produtos mais vendidos
  getProdutosMaisVendidos: (periodo: string, categoria_id?: number) =>
    ipcRenderer.invoke('get-produtos-mais-vendidos', periodo, categoria_id),

  // Função para obter os serviços mais vendidos
  getServicosMaisVendidos: (periodo: string) =>
    ipcRenderer.invoke('get-servicos-mais-vendidos', periodo),

  // Função para obter o lucro total da loja
  getLucroTotalLoja: (periodo: string) =>
    ipcRenderer.invoke('get-lucro-total-loja', periodo),

  // Função para obter o lucro total
  getLucroTotal: (periodo: string) =>
    ipcRenderer.invoke('get-lucro-total', periodo),

  // Função para obter as vendas por método de pagamento
  getVendasPorMetodoPagamento: (periodo: string) =>
    ipcRenderer.invoke('get-vendas-por-metodo-pagamento', periodo),

  // Função para obter as despesas por tipo
  getDespesasPorTipo: (periodo: string) =>
    ipcRenderer.invoke('get-despesas-por-tipo', periodo),

  // Função para obter vendas por cliente
  getVendasPorCliente: (periodo: string) =>
    ipcRenderer.invoke('get-vendas-por-cliente', periodo),

  // Função para comparar vendas de produtos vs serviços
  getVendasProdutosVsServicos: (periodo: string) =>
    ipcRenderer.invoke('get-vendas-produtos-vs-servicos', periodo),

  // Função para comparar custo vs lucro
  getCustoVsLucro: (periodo: string, categoria_id?: number) =>
    ipcRenderer.invoke('get-custo-vs-lucro', periodo, categoria_id),

  getClientesMaisCompraramProdutos: (periodo: string, limite: number, categoria_id?: number) =>
    ipcRenderer.invoke('get-clientes-mais-compraram-produtos', periodo, limite, categoria_id),

  getClientesMaisCompraramServicos: (periodo: string, limite: number) =>
    ipcRenderer.invoke('get-clientes-mais-compraram-servicos', periodo, limite),

  getHistoricoComprasCliente: (cliente_id: number) =>
    ipcRenderer.invoke('get-historico-compras-cliente', cliente_id),

  getVendasProdutosPorMetodoPagamento: (periodo: string, categoria_id?: number) =>
    ipcRenderer.invoke('get-vendas-produtos-por-metodo-pagamento', periodo, categoria_id),

  getVendasServicosPorMetodoPagamento: (periodo: string) =>
    ipcRenderer.invoke('get-vendas-servicos-por-metodo-pagamento', periodo),

  getProdutosSemEstoque: () => ipcRenderer.invoke('get-produtos-sem-estoque'),

  getQuantidadeEReceitaProdutos: () => ipcRenderer.invoke("get-quantidade-e-receita-produtos"),

  getClientesComVendasPendentes: () => ipcRenderer.invoke("get-clientes-com-vendas-pendentes"),

  getClientesAtendidosHoje: () => ipcRenderer.invoke("get-clientes-atendidos-hoje"),

  getQuantidadeEReceitaServicos: (periodo: string) => ipcRenderer.invoke("get-quantidade-e-receita-servicos", periodo),

  // Contas a Pagar
  createContaPagar: (
    descricao: string,
    valor: number,
    data_vencimento: string,
    fornecedor: string,
    tipo: string,
    observacao?: string,
    forma_pagamento?: string
  ) => ipcRenderer.invoke('create-conta-pagar', descricao, valor, data_vencimento, fornecedor, tipo, observacao, forma_pagamento),

  getAllContasPagar: () => ipcRenderer.invoke('get-all-contas-pagar'),

  getContaPagarById: (id: number) => ipcRenderer.invoke('get-conta-pagar-by-id', id),

  updateContaPagar: (
    id: number,
    descricao: string,
    valor: number,
    data_vencimento: string,
    fornecedor: string,
    tipo: string,
    observacao?: string,
    forma_pagamento?: string
  ) => ipcRenderer.invoke('update-conta-pagar', id, descricao, valor, data_vencimento, fornecedor, tipo, observacao, forma_pagamento),

  marcarContaComoPaga: (id: number, data_pagamento: string, forma_pagamento: string) =>
    ipcRenderer.invoke('marcar-conta-como-paga', id, data_pagamento, forma_pagamento),

  deleteContaPagar: (id: number) => ipcRenderer.invoke('delete-conta-pagar', id),

  getContasPagarPorStatus: (status: string) => ipcRenderer.invoke('get-contas-pagar-por-status', status),

  getContasPagarPorPeriodo: (dataInicio: string, dataFim: string) =>
    ipcRenderer.invoke('get-contas-pagar-por-periodo', dataInicio, dataFim),

  getTotalContasPagarPorStatus: (status: string) =>
    ipcRenderer.invoke('get-total-contas-pagar-por-status', status),

  getContasVencidas: () => ipcRenderer.invoke('get-contas-vencidas'),

  getContasAVencer: (dias: number) => ipcRenderer.invoke('get-contas-a-vencer', dias),

  // Métodos para categorias
  createCategoria: (nome: string, descricao: string) =>
    ipcRenderer.invoke('create-categoria', nome, descricao),

  getAllCategorias: () => ipcRenderer.invoke('get-all-categorias'),

  getCategoriaById: (id: number) => ipcRenderer.invoke('get-categoria-by-id', id),

  updateCategoria: (id: number, nome: string, descricao: string) =>
    ipcRenderer.invoke('update-categoria', id, nome, descricao),

  deleteCategoria: (id: number) => ipcRenderer.invoke('delete-categoria', id),

  // Insights por categoria
  getProdutosMaisVendidosPorCategoria: (periodo: string, categoria_id?: number) =>
    ipcRenderer.invoke('get-produtos-mais-vendidos-por-categoria', periodo, categoria_id),

  getLucroTotalPorCategoria: (periodo: string, categoria_id?: number) =>
    ipcRenderer.invoke('get-lucro-total-por-categoria', periodo, categoria_id),

  getValorAtendimentosHoje: () => ipcRenderer.invoke("get-valor-atendimentos-hoje"),

  getServicoMaisVendidoHoje: () => ipcRenderer.invoke("get-servico-mais-vendido-hoje"),

  // Créditos de Clientes
  createCreditoCliente: (cliente_id: number, valor: number, data_credito: string, observacao?: string) =>
    ipcRenderer.invoke('create-credito-cliente', cliente_id, valor, data_credito, observacao),

  getAllCreditosClientes: () => ipcRenderer.invoke('get-all-creditos-clientes'),

  getCreditosClienteById: (cliente_id: number) =>
    ipcRenderer.invoke('get-creditos-cliente-by-id', cliente_id),

  getSaldoCreditoCliente: (cliente_id: number) =>
    ipcRenderer.invoke('get-saldo-credito-cliente', cliente_id),

  utilizarCreditoCliente: (credito_id: number, data_utilizacao: string) =>
    ipcRenderer.invoke('utilizar-credito-cliente', credito_id, data_utilizacao),

  estornarCreditoCliente: (credito_id: number) =>
    ipcRenderer.invoke('estornar-credito-cliente', credito_id),

  deleteCreditoCliente: (credito_id: number) =>
    ipcRenderer.invoke('delete-credito-cliente', credito_id),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api); // Expondo a API personalizada para o frontend
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api; // Expondo a API personalizada para o frontend
}
