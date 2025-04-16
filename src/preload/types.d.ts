interface Window {
  api: {
    closeWindow: () => void;
    getAllDespesas: () => Promise<Despesa[]>;
    createDespesa: (descricao: string, valor: number, data: string, tipo: string, origem: string) => Promise<void>;
    updateDespesa: (id: number, descricao: string, valor: number, data: string, tipo: string, origem: string) => Promise<void>;
    deleteDespesa: (id: number) => Promise<void>;
  }
}

interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: string;
  origem: string;
}
