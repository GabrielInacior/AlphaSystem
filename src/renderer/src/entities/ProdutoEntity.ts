export class ProdutoEntity {
  id?: number;
  nome: string;
  custo: number;
  preco: number;
  qtdEstoque: number;
  lucroPorcentagem: number;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.custo = data.custo;
    this.preco = data.preco;
    this.qtdEstoque = data.qtdEstoque;
    this.lucroPorcentagem = data.lucroPorcentagem;
  }
}
