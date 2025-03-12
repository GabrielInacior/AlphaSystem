export class ServicoEntity {
  id?: number;
  nome: string;
  preco: number;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.preco = data.preco;
  }
}
