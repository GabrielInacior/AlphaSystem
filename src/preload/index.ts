/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  closeWindow: () => ipcRenderer.send('close-window'),
  createCliente: (nome: string, aniversario: string) =>
    ipcRenderer.invoke('create-cliente', nome, aniversario),
  getAllClientes: () => ipcRenderer.invoke('get-all-clientes'),
  getClienteById: (id: number) => ipcRenderer.invoke('get-cliente-by-id', id),
  updateCliente: (id: number, nome: string, aniversario: string) =>
    ipcRenderer.invoke('update-cliente', id, nome, aniversario),
  deleteCliente: (id: number) => ipcRenderer.invoke('delete-cliente', id),

  createServico: (nome: string, preco: number, desconto: number) =>
    ipcRenderer.invoke('create-servico', nome, preco, desconto),
  getAllServicos: () => ipcRenderer.invoke('get-all-servicos'),
  getServicoById: (id: number) => ipcRenderer.invoke('get-servico-by-id', id),
  updateServico: (id: number, nome: string, preco: number, desconto: number) =>
    ipcRenderer.invoke('update-servico', id, nome, preco, desconto),
  deleteServico: (id: number) => ipcRenderer.invoke('delete-servico', id),

  createProduto: (nome: string, custo: number) =>
    ipcRenderer.invoke('create-produto', nome, custo),
  getAllProdutos: () => ipcRenderer.invoke('get-all-produtos'),
  getProdutoById: (id: number) => ipcRenderer.invoke('get-produto-by-id', id),
  updateProduto: (id: number, nome: string, custo: number) =>
    ipcRenderer.invoke('update-produto', id, nome, custo),
  deleteProduto: (id: number) => ipcRenderer.invoke('delete-produto', id),

  createVendaServico: (cliente_id: number, servico_id: number, valor_total: number, metodo_pagamento: string, data: string) =>
    ipcRenderer.invoke('create-venda-servico', cliente_id, servico_id, valor_total, metodo_pagamento, data),

  createVendaProduto: (cliente_id: number, produto_id: number, quantidade: number, valor_total: number, metodo_pagamento: string, data: string) =>
    ipcRenderer.invoke('create-venda-produto', cliente_id, produto_id, quantidade, valor_total, metodo_pagamento, data),

  getAllVendas: (tabela: 'vendas_servicos' | 'vendas_produtos') =>
    ipcRenderer.invoke('get-all-vendas', tabela),

  getVendaById: (tabela: 'vendas_servicos' | 'vendas_produtos', id: number) =>
    ipcRenderer.invoke('get-venda-by-id', tabela, id),

  createDespesa: (descricao: string, valor: number, data: string, tipo: string) =>
    ipcRenderer.invoke('create-despesa', descricao, valor, data, tipo),
  getAllDespesas: () => ipcRenderer.invoke('get-all-despesas'),

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

  createFiado: (cliente_id: number, valor: number, data: string) =>
    ipcRenderer.invoke('create-fiado', cliente_id, valor, data),
  getAllFiados: () => ipcRenderer.invoke('get-all-fiados'),

  createPagamento: (venda_id: number, metodo_pagamento: string, valor_pago: number, data: string) =>
    ipcRenderer.invoke('create-pagamento', venda_id, metodo_pagamento, valor_pago, data),
  getPagamentosPorVenda: (venda_id: number) =>
    ipcRenderer.invoke('get-pagamentos-por-venda', venda_id),
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
