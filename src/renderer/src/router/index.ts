import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/barbearia',
    name: 'barbearia',
    component: Home,
    meta: { hideSidebar: false }
  },
  {
    path: '/loja',
    name: 'loja',
    component: Home,
    meta: { hideSidebar: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
