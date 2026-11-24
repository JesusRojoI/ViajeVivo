import en from '@/i18n/en.json';

const dictionary = en as Record<string, string>;

/**
 * Traducción basada en diccionarios JSON (es/en).
 * Útil en el servidor (correos, rutas API) donde no hay provider de React.
 */
export function translate(text: string, locale?: string): string {
  if (locale !== 'en') return text;
  return dictionary[text] ?? text;
}
