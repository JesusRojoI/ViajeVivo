"use client";

import { useLocale } from 'next-intl';
import { LegalPage } from "@/components/LegalPage";
import es from '@/i18n/legal-es.json';
import en from '@/i18n/legal-en.json';

export default function PoliticaDeReembolsos() {
  const locale = useLocale();
  const data = locale === 'en' ? en : es;
  return (
    <LegalPage
      title={locale === 'en' ? "Refunds and Cancellations" : "Política de Reembolsos"}
      sections={data.cancellation}
    />
  );
}
