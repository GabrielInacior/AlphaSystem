declare global {
  interface Window {
    api: {
      closeWindow: () => void;

      // Clientes
      createCliente: (nome: string, aniversario: string, telefone: string) => Promise<void>;
      getAllClientes: () => Promise<any[]>;
      getClienteById: (id: number) => Promise<any>;
      updateCliente: (id: number, nome: string, aniversario: string, telefone: string) => Promise<void>;
      deleteCliente: (id: number) => Promise<void>;
      getHistoricoComprasCliente: (cliente_id: number) => Promise<any[]>;

      // Serviços
      createServico: (nome: string, preco: number) => Promise<void>;
      getAllServicos: () => Promise<any[]>;
      getServicoById: (id: number) => Promise<any>;
      updateServico: (id: number, nome: string, preco: number) => Promise<void>;
      deleteServico: (id: number) => Promise<void>;

      // Produtos
      createProduto: (nome: string, custo: number, preco: number, qtdEstoque: number, categoria_id: number) => Promise<void>;
      getAllProdutos: () => Promise<any[]>;
      getProdutoById: (id: number) => Promise<any>;
      updateProduto: (id: number, nome: string, custo: number, preco: number, qtdEstoque: number, categoria_id: number) => Promise<void>;
      deleteProduto: (id: number) => Promise<void>;
      atualizarEstoqueProduto: (id: number, quantidadeVendida: number) => Promise<void>;

      // Categorias
      createCategoria: (nome: string, descricao: string) => Promise<void>;
      getAllCategorias: () => Promise<any[]>;
      getCategoriaById: (id: number) => Promise<any>;
      updateCategoria: (id: number, nome: string, descricao: string) => Promise<void>;
      deleteCategoria: (id: number) => Promise<void>;

      // Vendas
      createVenda: (
        cliente_id: number,
        valor_total: number,
        valor_pago: number,
        metodo_pagamento: string,
        status: string,
        data: string,
        itens: any[]
      ) => Promise<void>;
      getTodasVendas: () => Promise<any[]>;
      getVendasPagas: () => Promise<any[]>;
      getVendasFiado: () => Promise<any[]>;
      getItensVendidos: () => Promise<any[]>;
      updateVenda: (id: number, valor_total:number, valor_pago: number, metodo_pagamento: string, status: string, data: string) => Promise<void>;
      deleteVenda: (id: number) => Promise<void>;
      getTotalVendasPorTipo: (tipo: string) => Promise<number>;
      getTotalVendasPorPeriodo: (tipo: string, periodo: string) => Promise<number>;
      getVendaById: (venda_id: number) => Promise<any>;
      getVendasPorData: (data: string) => Promise<any[]>;

      // Despesas
      createDespesa: (descricao: string, valor: number, data: string | null, tipo: string) => Promise<void>;
      getAllDespesas: () => Promise<any[]>;
      updateDespesa: (id: number, descricao: string, valor: number, data: string | null, tipo: string) => Promise<void>;
      deleteDespesa: (id: number) => Promise<void>;

      // Fechamento de Caixa
      createFechamentoCaixa: (
        tipo: string,
        total_vendas: number,
        total_despesas: number,
        total_cartao: number,
        total_pix: number,
        total_dinheiro: number,
        total_banco: number,
        data: string
      ) => Promise<void>;
      getFechamentoCaixaPorData: (tipo: string, data: string) => Promise<any>;
      getFechamentoCaixaPorTipo: (tipo: string) => Promise<any>;
      getFechamentoCaixaPorId: (id: number) => Promise<any>;
      updateFechamentoCaixa: (
        id: number,
        total_vendas: number,
        total_despesas: number,
        total_cartao: number,
        total_pix: number,
        total_dinheiro: number,
        total_banco: number,
        data: string
      ) => Promise<void>;
    };
  }
}

export {};
