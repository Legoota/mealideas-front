/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#0E1513',
    surface: '#343B39',
    'on-surface': "#DDE4E1",
    'surface-bright': '#343B39',
    'surface-light': '#83D5C6',
    'surface-variant': '#3F4946',
    'on-surface-variant': '#BEC9C5',
    primary: '#83D5C6',
    'primary-darken-1': '#003730',
    secondary: '#B1CCC5',
    'secondary-darken-1': '#1C3530',
    error: '#FFB4AB',
    info: '#2196F3',
    success: '#83D5C6',
    warning: '#FB8C00',
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
  date: {
    locale: {
      en: 'fr-FR',
    },
  },
})
