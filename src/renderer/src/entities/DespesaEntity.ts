export class DespesaEntity {
  id?: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: string;

  constructor(data: any) {
    this.id = data.id;
    this.descricao = data.descricao;
    this.valor = data.valor;
    this.data = data.data;
    this.tipo = data.tipo;
  }
}
