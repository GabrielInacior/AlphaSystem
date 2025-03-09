// ipcHandlers.ts
import { ipcMain } from 'electron';
import * as Cliente from './clientes';
import * as Servico from './servicos';
import * as Produto from './produtos';
import * as Venda from './vendas';
import * as Fiado from './fiado';
import * as Despesa from './despesas';
import * as Pagamento from './pagamentos';
import * as Fechamento from './fechamentoCaixa';
import { Database } from 'sqlite3';

// Função que recebe a instância do banco de dados e registra os handlers IPC
export const registerIpcHandlers = (db: Database) => {
  // Clientes
  ipcMain.handle('create-cliente', async (_event, nome: string, aniversario: string) => {
    try {
      await Cliente.createCliente(db, nome, aniversario);
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

  ipcMain.handle('update-cliente', async (_event, id: number, nome: string, aniversario: string) => {
    try {
      await Cliente.updateCliente(db, id, nome, aniversario);
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
  ipcMain.handle('create-servico', async (_event, nome: string, preco: number, desconto: number) => {
    try {
      await Servico.createServico(db, nome, preco, desconto);
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

  ipcMain.handle('update-servico', async (_event, id: number, nome: string, preco: number, desconto: number) => {
    try {
      await Servico.updateServico(db, id, nome, preco, desconto);
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
  ipcMain.handle('create-produto', async (_event, nome: string, custo: number) => {
    try {
      await Produto.createProduto(db, nome, custo);
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

  ipcMain.handle('update-produto', async (_event, id: number, nome: string, custo: number) => {
    try {
      await Produto.updateProduto(db, id, nome, custo);
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

  /* Pagamentos */
  ipcMain.handle('create-pagamento', async (_event, venda_id: number, metodo_pagamento: string, valor_pago: number, data: string) => {
    try {
      Pagamento.createPagamento(db, venda_id, metodo_pagamento, valor_pago, data)
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      throw error
    }
  })

  ipcMain.handle('get-pagamentos-por-venda', async (_event, venda_id: number) => {
    try {
      return await Pagamento.getPagamentosPorVenda(db, venda_id)
    } catch (error) {
      console.error('Erro ao obter pagamentos por venda:', error)
      throw error
    }
  })

  // Vendas
  ipcMain.handle('create-venda-servico', async (_event, cliente_id: number, servico_id: number, valor_total: number, metodo_pagamento: string, data: string) => {
    try {
      await Venda.createVendaServico(db, cliente_id, servico_id, valor_total, metodo_pagamento, data);
    } catch (error) {
      console.error('Erro ao criar venda de serviço:', error);
      throw error;
    }
  });

  ipcMain.handle('create-venda-produto', async (_event, cliente_id: number, produto_id: number, quantidade: number, valor_total: number, metodo_pagamento: string, data: string) => {
    try {
      await Venda.createVendaProduto(db, cliente_id, produto_id, quantidade, valor_total, metodo_pagamento, data);
    } catch (error) {
      console.error('Erro ao criar venda de produto:', error);
      throw error;
    }
  });

  ipcMain.handle('get-all-vendas', async (_event, tabela: 'vendas_servicos' | 'vendas_produtos') => {
    try {
      return await Venda.getAllVendas(db, tabela);
    } catch (error) {
      console.error('Erro ao obter todas as vendas:', error);
      throw error;
    }
  });

  // Fiado
  ipcMain.handle('create-fiado', async (_event, cliente_id: number, valor: number, data: string) => {
    try {
      await Fiado.createFiado(db, cliente_id, valor, data);
    } catch (error) {
      console.error('Erro ao criar fiado:', error);
      throw error;
    }
  });

  ipcMain.handle('get-all-fiados', async () => {
    try {
      return await Fiado.getAllFiados(db);
    } catch (error) {
      console.error('Erro ao obter todos os fiados:', error);
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
