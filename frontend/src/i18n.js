import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Ojasritu Wellness',
      products: 'Products',
      contact: 'Contact',
      login: 'Login',
      signup: 'Sign up',
    },
  },
  hi: {
    translation: {
      welcome: 'ओजसृतिक वेलनेस में आपका स्वागत है',
      products: 'उत्पाद',
      contact: 'संपर्क करें',
      login: 'लॉगिन',
      signup: 'साइन अप',
    },
  },
}

const defaultLang = window && window.localStorage && window.localStorage.getItem('lang') ? window.localStorage.getItem('lang') : 'en'

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
