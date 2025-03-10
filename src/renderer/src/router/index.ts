import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ClienteView from '../views/ClienteView.vue'
import ServicoView from '../views/ServicoView.vue'
import ProdutoView from '../views/ProdutoView.vue'
import FiadoView from '../views/FiadoView.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: Home
  },
  {
    path: '/barbearia',
    name: 'barbearia',
    component: Home,
    children: [
      {
        path: 'servicos',
        name: 'servicos',
        component: ServicoView
      }
    ]
  },
  {
    path: '/loja',
    name: 'loja',
    component: Home,
    children: [
      {
        path: 'produtos',
        name: 'produtos',
        component: ProdutoView
      }
    ]
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: ClienteView,
    children: [
      {
        path: 'fiados',
        name: 'fiados',
        component: FiadoView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
