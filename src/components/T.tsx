"use client";

import { useTranslation } from 'react-i18next';

interface TProps {
  children: string;
}

/** Traducción declarativa usando los diccionarios JSON de i18n (sin servicios externos). */
export function T({ children }: TProps) {
  const { t } = useTranslation();
  return <span>{t(children)}</span>;
}
