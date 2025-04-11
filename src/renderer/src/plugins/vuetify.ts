import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { VNumberInput } from 'vuetify/labs/VNumberInput'  // Importando o componente do Vuetify Labs
import { md3 } from 'vuetify/blueprints'
import '@mdi/font/css/materialdesignicons.css' // Certifique-se de importar os estilos dos ícones MDI

// Importar componentes e diretivas do Vuetify
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Criar a instância do Vuetify com os componentes e a configuração necessária
const vuetify = createVuetify({
  blueprint: md3,
  components: {
    ...components,
    VNumberInput,
  },
  directives,
  icons: {
    defaultSet: 'mdi', // Configura 'mdi' como o conjunto padrão de ícones
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#f472b6',
          error: '#ef4444',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          sidebarbg: '#ffffff',
          background: '#ffffff',
          surface: '#f8fafc',
          'on-surface': '#1e293b',
          'on-background': '#1e293b',
          'on-primary': '#ffffff',
          'on-secondary': '#ffffff',
          'on-accent': '#ffffff',
          'on-error': '#ffffff',
          'on-info': '#ffffff',
          'on-success': '#ffffff',
          'on-warning': '#ffffff',
          'surface-variant': '#f1f5f9',
          'on-surface-variant': '#64748b',
          'outline': '#cbd5e1',
          'outline-variant': '#e2e8f0',
          'shadow': '#0f172a',
          'scrim': '#0f172a',
          'inverse-surface': '#1e293b',
          'inverse-on-surface': '#f8fafc',
          'inverse-primary': '#818cf8',
        },
        variables: {
          'border-color': '#e2e8f0',
          'border-opacity': 1,
          'high-emphasis-opacity': 0.87,
          'medium-emphasis-opacity': 0.60,
          'disabled-opacity': 0.38,
          'idle-opacity': 0.04,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.08,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.12,
          'dragged-opacity': 0.08,
          'theme-kbd': '#f8fafc',
          'theme-on-kbd': '#1e293b',
          'theme-code': '#f1f5f9',
          'theme-on-code': '#1e293b',
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#818cf8',
          secondary: '#a78bfa',
          accent: '#f472b6',
          error: '#f87171',
          info: '#60a5fa',
          success: '#34d399',
          warning: '#fbbf24',
          sidebarbg: '#1E293B',
          background: '#0f172a',
          surface: '#1e293b',
          'on-surface': '#f8fafc',
          'on-background': '#f8fafc',
          'on-primary': '#0f172a',
          'on-secondary': '#0f172a',
          'on-accent': '#0f172a',
          'on-error': '#0f172a',
          'on-info': '#0f172a',
          'on-success': '#0f172a',
          'on-warning': '#0f172a',
          'surface-variant': '#334155',
          'on-surface-variant': '#cbd5e1',
          'outline': '#475569',
          'outline-variant': '#334155',
          'shadow': '#000000',
          'scrim': '#000000',
          'inverse-surface': '#f8fafc',
          'inverse-on-surface': '#1e293b',
          'inverse-primary': '#6366f1',
        },
        variables: {
          'border-color': '#334155',
          'border-opacity': 1,
          'high-emphasis-opacity': 0.87,
          'medium-emphasis-opacity': 0.60,
          'disabled-opacity': 0.38,
          'idle-opacity': 0.04,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.08,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.12,
          'dragged-opacity': 0.08,
          'theme-kbd': '#1e293b',
          'theme-on-kbd': '#f8fafc',
          'theme-code': '#334155',
          'theme-on-code': '#f8fafc',
        }
      }
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      elevation: 0,
    },
    VCard: {
      rounded: 'lg',
      elevation: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VDataTable: {
      density: 'comfortable',
    },
  },
})

export default vuetify
