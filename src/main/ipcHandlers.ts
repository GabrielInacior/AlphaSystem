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
  ipcMain.handle('create-venda', async (_event, cliente_id, valor_total, metodo_pagamento, status, data, itens) => {
    try {
      return await Venda.createVenda(db, cliente_id, valor_total, metodo_pagamento, status, data, itens);
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
  ipcMain.handle('update-venda', async (_event, venda_id, valor_pago, metodo_pagamento, status) => {
    try {
      await Venda.updateVenda(db, venda_id, valor_pago, metodo_pagamento, status);
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

  ipcMain.handle('get-all-despesas', async () => {
    try {
      return await Despesa.getAllDespesas(db);
    } catch (error) {
      console.error('Erro ao obter todas as despesas:', error);
      throw error;
    }
  });

  // Fechamento Caixa
  ipcMain.handle('create-fechamento-caixa', async (_event, tipo: string, total_vendas: number, total_despesas: number, total_cartao: number, total_pix: number, total_dinheiro: number, total_banco: number, data: string) => {
    try {
      await Fechamento.createFechamentoCaixa(db, tipo, total_vendas, total_despesas, total_cartao, total_pix, total_dinheiro, total_banco, data);
    } catch (error) {
      console.error('Erro ao criar fechamento de caixa:', error);
      throw error;
    }
  });

  ipcMain.handle('get-fechamento-caixa-por-data', async (_event, tipo: string, data: string) => {
    try {
      return await Fechamento.getFechamentoCaixaPorData(db, tipo, data);
    } catch (error) {
      console.error('Erro ao obter fechamento de caixa por data:', error);
      throw error;
    }
  });


};
