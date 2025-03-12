export class FechamentoCaixaEntity {
  id?: number;
  tipo: string;
  total_mes: number;
  total_semana: number;
  total_dia: number;
  total_cartao: number;
  total_pix: number;
  total_dinheiro: number;
  total_banco: number;
  data: string;

  constructor(data: any) {
    this.id = data.id;
    this.tipo = data.tipo;
    this.total_mes = data.total_mes;
    this.total_semana = data.total_semana;
    this.total_dia = data.total_dia;
    this.total_cartao = data.total_cartao;
    this.total_pix = data.total_pix;
    this.total_dinheiro = data.total_dinheiro;
    this.total_banco = data.total_banco;
    this.data = data.data;
  }
}
