import "../globals.css";
import { ClientBody } from "@/app/ClientBody";
import { ReactNode } from "react";
import type { Metadata } from "next";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "ViajeVivo | Tu Próxima Gran Aventura",
  description: "Curamos itinerarios a la medida y experiencias inolvidables. Descubre el mundo con ViajeVivo: viaja vivo, viaja a tu ritmo.",
  metadataBase: new URL("https://viajevivo.com.mx"),
};

export default async function RootLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  return (
    <html lang={locale}>
      <ClientBody locale={locale}>
        {children}
      </ClientBody>
    </html>
  );
}
