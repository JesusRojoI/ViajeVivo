"use client";

import { useLocale } from 'next-intl';
import { LegalPage } from "@/components/LegalPage";
import es from '@/i18n/legal-es.json';
import en from '@/i18n/legal-en.json';

export default function TerminosYCondiciones() {
  const locale = useLocale();
  const data = locale === 'en' ? en : es;
  return (
    <LegalPage
      title={locale === 'en' ? "Terms and Conditions" : "Términos y Condiciones"}
      sections={data.terms}
    />
  );
}
