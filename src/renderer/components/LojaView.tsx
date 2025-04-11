import { useState, useEffect } from 'react';
import { Periodo } from '../types/periodo';
import { Categoria } from '../types/categoria';

interface Window {
  electron: {
    ipcRenderer: {
      invoke(channel: string, ...args: any[]): Promise<any>;
    };
  };
}

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
      };
    };
  }
}

const [periodo, setPeriodo] = useState<Periodo>({
  dataInicio: new Date(),
  dataFim: new Date()
});

const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
const [vendasProdutosPorData, setVendasProdutosPorData] = useState<any[]>([]);
const [produtosMaisVendidos, setProdutosMaisVendidos] = useState<any[]>([]);
const [custoVsLucro, setCustoVsLucro] = useState<any[]>([]);
const [vendasPorMetodoPagamento, setVendasPorMetodoPagamento] = useState<any[]>([]);

const fetchVendasProdutosPorData = async () => {
  try {
    const data = await window.electron.ipcRenderer.invoke(
      'get-vendas-produtos-por-data',
      periodo,
      selectedCategory
    );
    setVendasProdutosPorData(data);
  } catch (error) {
    console.error('Erro ao buscar vendas de produtos por data:', error);
  }
};

const fetchProdutosMaisVendidos = async () => {
  try {
    const data = await window.electron.ipcRenderer.invoke(
      'get-produtos-mais-vendidos',
      periodo,
      selectedCategory
    );
    setProdutosMaisVendidos(data);
  } catch (error) {
    console.error('Erro ao buscar produtos mais vendidos:', error);
  }
};

const fetchCustoVsLucro = async () => {
  try {
    const data = await window.electron.ipcRenderer.invoke(
      'get-custo-vs-lucro',
      periodo,
      selectedCategory
    );
    setCustoVsLucro(data);
  } catch (error) {
    console.error('Erro ao buscar custo vs lucro:', error);
  }
};

const fetchVendasPorMetodoPagamento = async () => {
  try {
    const data = await window.electron.ipcRenderer.invoke(
      'get-vendas-produtos-por-metodo-pagamento',
      periodo,
      selectedCategory
    );
    setVendasPorMetodoPagamento(data);
  } catch (error) {
    console.error('Erro ao buscar vendas por método de pagamento:', error);
  }
};
