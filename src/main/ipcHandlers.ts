// ipcHandlers.ts
import { ipcMain } from 'electron';
import * as Cliente from './clientes';
import * as Servico from './servicos';
import * as Produto from './produtos';
import * as Venda from './vendas';
import * as Despesa from './despesas';
import * as Fechamento from './fechamentoCaixa';
import { Database } from 'sqlite3';

// Função que recebe a instância do banco de dados e registra os handlers IPC
export const registerIpcHandlers = (db: Database) => {
  // Clientes
  ipcMain.handle('create-cliente', async (_event, nome: string, aniversario: string, telefone: string) => {
    try {
      await Cliente.createCliente(db, nome, aniversario, telefone);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  });

  ipcMain.handle('get-all-clientes', async () => {
    try {
      return await Cliente.getAllClientes(db);
    } catch (error) {
      console.error('Erro ao obter todos os clientes:', error);
      throw error;
    }
  });

  ipcMain.handle('get-cliente-by-id', async (_event, id: number) => {
    try {
      return await Cliente.getClienteById(db, id);
    } catch (error) {
      console.error('Erro ao obter cliente:', error);
      throw error;
    }
  });


  ipcMain.handle('get-clientes-aniversariantes', async (_event) => {
    try {
      return await Cliente.getClientesAniversariantes(db);
    } catch (error) {
      console.error('Erro ao obter cliente:', error);
      throw error;
    }
  });

  ipcMain.handle('update-cliente', async (_event, id: number, nome: string, aniversario: string, telefone:string) => {
    try {
      await Cliente.updateCliente(db, id, nome, aniversario, telefone);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  });

  ipcMain.handle('delete-cliente', async (_event, id: number) => {
    try {
      await Cliente.deleteCliente(db, id);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  });

  // Serviços
  ipcMain.handle('create-servico', async (_event, nome: string, preco: number) => {
    try {
      await Servico.createServico(db, nome, preco);
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw error;
    }
  });

  ipcMain.handle('get-all-servicos', async () => {
    try {
      return await Servico.getAllServicos(db);
    } catch (error) {
      console.error('Erro ao obter todos os serviços:', error);
      throw error;
    }
  });

  ipcMain.handle('get-servico-by-id', async (_event, id: number) => {
    try {
      return await Servico.getServicoById(db, id);
    } catch (error) {
      console.error('Erro ao obter serviço:', error);
      throw error;
    }
  });

  ipcMain.handle('update-servico', async (_event, id: number, nome: string, preco: number) => {
    try {
      await Servico.updateServico(db, id, nome, preco);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw error;
    }
  });

  ipcMain.handle('delete-servico', async (_event, id: number) => {
    try {
      await Servico.deleteServico(db, id);
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      throw error;
    }
  });

  // Produtos
  ipcMain.handle('create-produto', async (_event, nome: string, custo: number, preco: number, qtdEstoque: number) => {
    try {
      await Produto.createProduto(db, nome, custo, preco, qtdEstoque);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  });

  ipcMain.handle('get-all-produtos', async () => {
    try {
      return await Produto.getAllProdutos(db);
    } catch (error) {
      console.error('Erro ao obter todos os produtos:', error);
      throw error;
    }
  });

  ipcMain.handle('get-produto-by-id', async (_event, id: number) => {
    try {
      return await Produto.getProdutoById(db, id);
    } catch (error) {
      console.error('Erro ao obter produto:', error);
      throw error;
    }
  });

  ipcMain.handle('update-produto', async (_event, id: number, nome: string, custo: number, preco: number, qtdEstoque: number) => {
    try {
      await Produto.updateProduto(db, id, nome, custo, preco, qtdEstoque);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  });

  ipcMain.handle('delete-produto', async (_event, id: number) => {
    try {
      await Produto.deleteProduto(db, id);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  });


  // Vendas

  // Obter todas as vendas
  ipcMain.handle('get-todas-vendas', async () => {
    try {
      return await Venda.getTodasVendas(db);
    } catch (error) {
      console.error('Erro ao obter todas as vendas:', error);
      throw error;
    }
  });

  // Obter vendas pagas
  ipcMain.handle('get-vendas-pagas', async () => {
    try {
      return await Venda.getVendasPagas(db);
    } catch (error) {
      console.error('Erro ao obter vendas pagas:', error);
      throw error;
    }
  });

  // Obter vendas fiado (não pagas)
  ipcMain.handle('get-vendas-fiado', async () => {
    try {
      return await Venda.getVendasFiado(db);
    } catch (error) {
      console.error('Erro ao obter vendas fiado:', error);
      throw error;
    }
  });

  // Obter todos os itens vendidos
  ipcMain.handle('get-itens-vendidos', async () => {
    try {
      return await Venda.getItensVendidos(db);
    } catch (error) {
      console.error('Erro ao obter itens vendidos:', error);
      throw error;
    }
  });

  // Criar venda
  ipcMain.handle('create-venda', async (_event, cliente_id, valor_total, valor_pago,  metodo_pagamento, status, data, itens) => {
    try {
      return await Venda.createVenda(db, cliente_id, valor_total, valor_pago, metodo_pagamento, status, data, itens);
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      throw error;
    }
  });

  // Obter total de vendas por tipo (serviço ou produto)
  ipcMain.handle('get-total-vendas-por-tipo', async (_event, tipo) => {
    try {
      return await Venda.getTotalVendasPorTipo(db, tipo);
    } catch (error) {
      console.error('Erro ao obter total de vendas por tipo:', error);
      throw error;
    }
  });

  // Obter total de vendas por período (dia, mês, ano)
  ipcMain.handle('get-total-vendas-por-periodo', async (_event, tipo, periodo) => {
    try {
      return await Venda.getTotalVendasPorPeriodo(db, tipo, periodo);
    } catch (error) {
      console.error('Erro ao obter total de vendas por período:', error);
      throw error;
    }
  });

  // Obter venda por ID
  ipcMain.handle('get-venda-by-id', async (_event, venda_id) => {
    try {
      return await Venda.getVendaById(db, venda_id);
    } catch (error) {
      console.error('Erro ao obter venda por ID:', error);
      throw error;
    }
  });

  // Obter vendas por data
  ipcMain.handle('get-vendas-por-data', async (_event, data) => {
    try {
      return await Venda.getVendasPorData(db, data);
    } catch (error) {
      console.error('Erro ao obter vendas por data:', error);
      throw error;
    }
  });

  // Atualizar venda
  ipcMain.handle('update-venda', async (_event, venda_id, valor_total, valor_pago, metodo_pagamento, status, data) => {
    try {
      await Venda.updateVenda(db, venda_id,valor_total, valor_pago, metodo_pagamento, status, data);
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      throw error;
    }
  });

  // Deletar venda
  ipcMain.handle('delete-venda', async (_event, venda_id) => {
    try {
      await Venda.deleteVenda(db, venda_id);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
      throw error;
    }
  });


  // Despesas
  ipcMain.handle('create-despesa', async (_event, descricao: string, valor: number, data: string, tipo: string) => {
    try {
      await Despesa.createDespesa(db, descricao, valor, data, tipo);
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      throw error;
    }
  });

  ipcMain.handle('update-despesa', async (_event, id: number, descricao: string, valor: number, data: string, tipo: string) => {
    try {
      await Despesa.updateDespesa(db, id, descricao, valor, data, tipo);
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      throw error;
    }
  });


  ipcMain.handle('delete-despesa', async (_event, id: number) => {
    try {
      await Despesa.deleteDespesa(db, id);
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      throw error;
    }
  });

  ipcMain.handle('get-all-despesas', async () => {
    try {
      return await Despesa.getAllDespesas(db);
    } catch (error) {
      console.error('Erro ao obter todas as despesas:', error);
      throw error;
    }
  });

  ipcMain.handle('get-vendas-servicos-por-data', async (_event, periodo: string) => {
    try {
      return await Fechamento.getVendasServicosPorData(db, periodo);
    } catch (error) {
      console.error('Erro ao obter vendas de serviços por data:', error);
      throw error;
    }
  });

  // Função para obter vendas de produtos por data
  ipcMain.handle('get-vendas-produtos-por-data', async (_event, periodo: string) => {
    try {
      return await Fechamento.getVendasProdutosPorData(db, periodo);
    } catch (error) {
      console.error('Erro ao obter vendas de produtos por data:', error);
      throw error;
    }
  });

  // Função para obter os melhores clientes
  ipcMain.handle('get-melhores-clientes', async (_event, limite: number) => {
    try {
      return await Fechamento.getMelhoresClientes(db, limite);
    } catch (error) {
      console.error('Erro ao obter melhores clientes:', error);
      throw error;
    }
  });

  // Função para obter os produtos mais vendidos
  ipcMain.handle('get-produtos-mais-vendidos', async (_event, periodo: string) => {
    try {
      return await Fechamento.getProdutosMaisVendidos(db, periodo);
    } catch (error) {
      console.error('Erro ao obter produtos mais vendidos:', error);
      throw error;
    }
  });

  // Função para obter os serviços mais vendidos
  ipcMain.handle('get-servicos-mais-vendidos', async (_event, periodo: string) => {
    try {
      return await Fechamento .getServicosMaisVendidos(db, periodo);
    } catch (error) {
      console.error('Erro ao obter serviços mais vendidos:', error);
      throw error;
    }
  });

  // Função para obter o lucro total da loja
  ipcMain.handle('get-lucro-total-loja', async (_event, periodo: string) => {
    try {
      return await Fechamento.getLucroTotalLoja(db, periodo);
    } catch (error) {
      console.error('Erro ao obter lucro total da loja:', error);
      throw error;
    }
  });

  // Função para obter o lucro total
  ipcMain.handle('get-lucro-total', async (_event, periodo: string) => {
    try {
      return await Fechamento.getLucroTotal(db, periodo);
    } catch (error) {
      console.error('Erro ao obter lucro total:', error);
      throw error;
    }
  });

  // Função para obter as vendas por método de pagamento
  ipcMain.handle('get-vendas-por-metodo-pagamento', async (_event, periodo: string) => {
    try {
      return await Fechamento.getVendasPorMetodoPagamento(db, periodo);
    } catch (error) {
      console.error('Erro ao obter vendas por método de pagamento:', error);
      throw error;
    }
  });

  // Função para obter as despesas por tipo
  ipcMain.handle('get-despesas-por-tipo', async (_event, periodo: string) => {
    try {
      return await Fechamento.getDespesasPorTipo(db, periodo);
    } catch (error) {
      console.error('Erro ao obter despesas por tipo:', error);
      throw error;
    }
  });

  // Função para obter vendas por cliente
  ipcMain.handle('get-vendas-por-cliente', async (_event, periodo: string) => {
    try {
      return await Fechamento.getVendasPorCliente(db, periodo);
    } catch (error) {
      console.error('Erro ao obter vendas por cliente:', error);
      throw error;
    }
  });

  // Função para comparar vendas de produtos vs serviços
  ipcMain.handle('get-vendas-produtos-vs-servicos', async (_event, periodo: string) => {
    try {
      return await Fechamento.getVendasProdutosVsServicos(db, periodo);
    } catch (error) {
      console.error('Erro ao comparar vendas de produtos vs serviços:', error);
      throw error;
    }
  });

  // Função para comparar custo vs lucro
  ipcMain.handle('get-custo-vs-lucro', async (_event, periodo: string) => {
    try {
      return await Fechamento.getCustoVsLucro(db, periodo);
    } catch (error) {
      console.error('Erro ao comparar custo vs lucro:', error);
      throw error;
    }
  });

  ipcMain.handle('get-clientes-mais-compraram-produtos', async (_event, periodo: string, limite: number) => {
    try {
      return await Fechamento.getClientesMaisCompraramProdutos(db, periodo, limite);
    } catch (error) {
      console.error('Erro ao comparar custo vs lucro:', error);
      throw error;
    }
  });

  ipcMain.handle('get-clientes-mais-compraram-servicos', async (_event, periodo: string, limite: number) => {
    try {
      return await Fechamento.getClientesMaisCompraramServicos(db, periodo, limite);
    } catch (error) {
      console.error('Erro ao comparar custo vs lucro:', error);
      throw error;
    }
  });

  ipcMain.handle('get-vendas-produtos-por-metodo-pagamento', async (_event, periodo: string) => {
    try {
      return await Fechamento.getVendasProdutosPorMetodoPagamento(db, periodo);
    } catch (error) {
      console.error('Erro ao buscar dados', error);
      throw error;
    }
  });

  ipcMain.handle('get-vendas-servicos-por-metodo-pagamento', async (_event, periodo: string) => {
    try {
      return await Fechamento.getVendasServicosPorMetodoPagamento(db, periodo);
    } catch (error) {
      console.error('Erro ao buscar dados', error);
      throw error;
    }
  });

  ipcMain.handle('get-produtos-sem-estoque', async (_event) => {
    try {
      return await Fechamento.getProdutosSemEstoque(db);
    } catch (error) {
      console.error('Erro ao buscar dados', error);
      throw error;
    }
  });

  ipcMain.handle('get-quantidade-e-receita-produtos', async (_event) => {
    try {
      return await Fechamento.getQuantidadeEReceitaProdutos(db);
    } catch (error) {
      console.error('Erro ao buscar dados', error);
      throw error;
    }
  });

  ipcMain.handle('get-quantidade-e-receita-servicos', async (_event, periodo:string) => {
    try {
      return await Fechamento.getQuantidadeEReceitaServicos(db, periodo);
    } catch (error) {
      console.error('Erro ao buscar dados', error);
      throw error;
    }
  });

  ipcMain.handle('get-clientes-com-vendas-pendentes', async (_event) => {
    try {
      return await Fechamento.getClientesComVendasPendentes(db);
    } catch (error) {
      console.error('Erro ao buscar dados', error);
      throw error;
    }
  });
};
