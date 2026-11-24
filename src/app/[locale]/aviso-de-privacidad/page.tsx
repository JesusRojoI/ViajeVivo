"use client";

import { useLocale } from 'next-intl';
import { LegalPage } from "@/components/LegalPage";
import es from '@/i18n/legal-es.json';
import en from '@/i18n/legal-en.json';

export default function AvisoDePrivacidad() {
  const locale = useLocale();
  const data = locale === 'en' ? en : es;
  return (
    <LegalPage
      title={locale === 'en' ? "Privacy Notice" : "Aviso de Privacidad"}
      sections={data.privacy}
    />
  );
}
