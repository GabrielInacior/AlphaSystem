declare global {
  interface Window {
    api: {
      getAllClientes: () => Promise<any[]>;
      updateCliente: (id: number, nome: string, aniversario: string) => Promise<void>;
      createCliente: (nome: string, aniversario: string, telefone:string) => Promise<void>;
      deleteCliente: (id: number) => Promise<void>;
    };
  }
}
export {};
