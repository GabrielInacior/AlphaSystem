import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { md3 } from 'vuetify/blueprints'
import '@mdi/font/css/materialdesignicons.css' // Certifique-se de importar os estilos dos ícones MDI

// Importar componentes e diretivas do Vuetify
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  blueprint: md3,
  components,
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
        },
      },
      dark: {
        colors: {
          primary: '#1E1E1E',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },

})

export default vuetify
