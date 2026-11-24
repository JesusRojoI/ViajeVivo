"use client";

import { useMemo, type ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { I18nextProvider } from 'react-i18next';
import { NextIntlClientProvider } from 'next-intl';
import i18n from '@/lib/i18n';

interface ClientBodyProps {
  children: ReactNode;
  locale: string;
}

export function ClientBody({ children, locale }: ClientBodyProps) {
  const instance = useMemo(
    () => i18n.cloneInstance({ lng: locale, fallbackLng: 'es' }),
    [locale]
  );

  return (
    <body className="antialiased" suppressHydrationWarning>
      <NextIntlClientProvider locale={locale} timeZone="America/Mexico_City">
        <I18nextProvider i18n={instance}>
          <CartProvider>
            {children}
          </CartProvider>
        </I18nextProvider>
      </NextIntlClientProvider>
    </body>
  );
}
