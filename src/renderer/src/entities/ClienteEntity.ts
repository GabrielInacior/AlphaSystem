export class ClienteEntity {
  id?: number;
  nome: string;
  telefone?: string;
  aniversario?: string; // "YYYY-MM-DD"

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.telefone = data.telefone;
    this.aniversario = data.aniversario;
  }
}
