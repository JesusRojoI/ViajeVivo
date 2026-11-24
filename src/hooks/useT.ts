"use client";

import { useTranslation } from 'react-i18next';

/** Devuelve el texto traducido desde los diccionarios locales (es/en). */
export function useT(text: string) {
  const { t } = useTranslation();
  return t(text);
}
