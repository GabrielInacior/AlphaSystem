export class PagamentoEntity {
  id?: number;
  venda_id: number;
  metodo_pagamento: string;
  valor_pago: number;
  data: string;

  constructor(data: any) {
    this.id = data.id;
    this.venda_id = data.venda_id;
    this.metodo_pagamento = data.metodo_pagamento;
    this.valor_pago = data.valor_pago;
    this.data = data.data;
  }
}
