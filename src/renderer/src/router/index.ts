import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ClienteView from '../views/Clientes/ClienteView.vue'
import ServicoView from '../views/Barbearia/ServicoView.vue'
import ProdutoView from '../views/Loja/ProdutoView.vue'
import FiadoView from '../views/Vendas/FiadoView.vue'
import VendasProdutosView from '@renderer/views/Vendas/VendasView.vue'
import BarbeariaView from '../views/Barbearia/BarbeariaView.vue' // Nova rota para a home da barbearia
import LojaView from '../views/Loja/LojaView.vue' // Nova rota para a home da loja
import Inicio from '@renderer/views/Inicio.vue'
import DespesaView from '@renderer/views/Loja/DespesaView.vue'
import HistoricoVendas from '@renderer/views/Vendas/HistoricoVendas.vue'
import VendasView from '@renderer/views/Vendas/VendasView.vue'
import CategoriaView from '@renderer/views/Loja/CategoriaView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/inicio',
    children: [
      {
        path: 'inicio',
        name: 'inicio',
        component: Inicio,
      },
      {
        path: 'clientes',
        name: 'clientes',
        component: ClienteView,
      },
      {
        path: 'categorias',
        name: 'categorias',
        component: CategoriaView
      },

      {
        path: 'fiados',
        name: 'fiados',
        component: FiadoView
      },
      {
        path: 'servicos',
        name: 'servicos',
        component: ServicoView
      },
      {
        path: 'despesas',
        name: 'despesas',
        component: DespesaView
      },
      {
        path: 'vendas',
        name: 'vendas',
        component: VendasView
      },
      {
        path: 'historico-vendas',
        name: 'historico-vendas',
        component: HistoricoVendas
      },
      {
        path: 'barbearia',
        name: 'barbearia',
        component: BarbeariaView, // Home do módulo Barbearia
      },
      {
        path: 'produtos',
        name: 'produtos',
        component: ProdutoView
      },

      {
        path: 'vendasProduto',
        name: 'vendasProduto',
        component: VendasProdutosView
      },
      {
        path: 'loja',
        name: 'loja',
        component: LojaView, // Home do módulo Loja
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
