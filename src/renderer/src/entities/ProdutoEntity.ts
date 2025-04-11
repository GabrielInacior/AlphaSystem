export class ProdutoEntity {
  id?: number;
  nome: string;
  custo: number;
  preco: number;
  qtdEstoque: number;
  lucroPorcentagem: number;
  categoria_id: number | null;
  categoria_nome?: string;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.custo = data.custo;
    this.preco = data.preco;
    this.qtdEstoque = data.qtdEstoque;
    this.lucroPorcentagem = data.lucroPorcentagem;
    this.categoria_id = data.categoria_id || null;
    this.categoria_nome = data.categoria_nome;
  }
}
