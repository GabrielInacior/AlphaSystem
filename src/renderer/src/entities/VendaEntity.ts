export class VendaEntity {
  id: number;
  cliente_id: number;
  nome_cliente: string;
  valor_total: number;
  valor_pago: number;
  metodo_pagamento: string;
  status: string;
  data: string;
  itens?: Array<{
    produto_id: number;
    servico_id: number;
    nome_item: string;
    valor_unitario: number;
    quantidade: number;
    valor_total: number;
  }> = [];

  constructor(data: any) {
    this.id = data.id;
    this.cliente_id = data.cliente_id;
    this.nome_cliente = data.nome_cliente;
    this.valor_total = data.valor_total;
    this.valor_pago = data.valor_pago ?? 0;
    this.metodo_pagamento = data.metodo_pagamento;
    this.status = data.status;
    this.data = data.data;

    this.itens = data.itens.map((item: any) => ({
      produto_id: item.produto_id,
      servico_id: item.servico_id,
      nome_item: item.nome_item,
      valor_unitario: item.valor_unitario,
      quantidade: item.quantidade,
      valor_total: item.valor_total,
    }));
  }
}
