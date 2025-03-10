import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'  // Importando o Vue Router

createApp(App)
  .use(vuetify)
  .use(router)  // Usando o Vue Router
  .mount('#app')
