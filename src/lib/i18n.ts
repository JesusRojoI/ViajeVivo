import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

/**
 * Diccionarios locales en JSON. No se usa ningún servicio de traducción externo.
 * Las claves son los textos originales en español; el valor es la traducción.
 */
i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: 'es',
  fallbackLng: 'es',
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
