import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { VNumberInput } from 'vuetify/labs/VNumberInput'  // Importando o componente do Vuetify Labs
import { md2 } from 'vuetify/blueprints'
import '@mdi/font/css/materialdesignicons.css' // Certifique-se de importar os estilos dos ícones MDI

// Importar componentes e diretivas do Vuetify
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Criar a instância do Vuetify com os componentes e a configuração necessária
const vuetify = createVuetify({
  blueprint: md2,
  components: {
    ...components,
    VNumberInput, // Registrar o componente do Vuetify Labs aqui
  },
  directives,
  icons: {
    defaultSet: 'mdi', // Configura 'mdi' como o conjunto padrão de ícones
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background:'#FFFFFF',
          icon: "#000000",
        },
      },
      dark: {
        colors: {
          primary: '#FFFFFF',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background:'#121212',
          icon: "#FFFFFF",
        },
      },
    },
  },
})

export default vuetify
