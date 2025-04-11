export class CategoriaEntity {
  id?: number;
  nome: string;
  descricao: string;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.descricao = data.descricao;
  }
}
