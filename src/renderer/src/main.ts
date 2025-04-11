import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia';
import router from './router'  // Importando o Vue Router
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)  // Usando o Vue Router
app.use(VueApexCharts)

app.mount('#app')
