export class FiadoEntity {
  id?: number;
  cliente_id: number;
  valor: number;
  descricao: string;
  data: string;
  status: 'pendente' | 'pago';

  constructor(data: any) {
    this.id = data.id;
    this.cliente_id = data.cliente_id;
    this.valor = data.valor;
    this.descricao = data.descricao;
    this.data = data.data;
    this.status = data.status;
  }
}
