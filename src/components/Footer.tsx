"use client";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from "react";
import Link from "next/link";
import { T } from "@/components/T";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleLang = (lang: string) => {
    startTransition(() => router.replace(pathname.replace(`/${locale}`, `/${lang}`) || `/${lang}`));
  };

  return (
    <footer className="bg-primary text-white pt-20 pb-10 mt-16 border-t-8 border-accent">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="inline-flex bg-card rounded-none p-2">
              <img src="/logo-viajevivo.svg" alt="ViajeVivo" className="h-12 w-auto" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed font-medium max-w-xs">
              <T>Trazando el nuevo horizonte de la exploración en México. Rutas únicas, logística perfecta.</T>
            </p>
            <div className="flex border border-white/30 rounded-none p-1 w-fit">
              <button onClick={() => handleLang('es')} className={`px-4 py-1.5 rounded-sm text-xs font-black transition-all ${locale === 'es' ? 'bg-accent text-foreground' : 'text-white/60 hover:text-white'}`}>ES</button>
              <button onClick={() => handleLang('en')} className={`px-4 py-1.5 rounded-sm text-xs font-black transition-all ${locale === 'en' ? 'bg-accent text-foreground' : 'text-white/60 hover:text-white'}`}>EN</button>
            </div>
          </div>

          <div>
            <h4 className="vv-label text-accent mb-6"><T>Explorar</T></h4>
            <ul className="space-y-4 text-sm font-semibold text-white/70">
              <li><Link href={`/${locale}/`} className="hover:text-accent transition-colors"><T>Inicio</T></Link></li>
              <li><Link href={`/${locale}/experiencias`} className="hover:text-accent transition-colors"><T>Experiencias</T></Link></li>
              <li><Link href={`/${locale}/cotizar`} className="hover:text-accent transition-colors"><T>Diseñar mi ruta</T></Link></li>
              <li><Link href={`/${locale}/#precios`} className="hover:text-accent transition-colors"><T>Precios</T></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="vv-label text-accent mb-6"><T>Legal</T></h4>
            <ul className="space-y-4 text-sm font-semibold text-white/70">
              <li><Link href={`/${locale}/aviso-de-privacidad`} className="hover:text-accent transition-colors"><T>Aviso de Privacidad</T></Link></li>
              <li><Link href={`/${locale}/terminos-y-condiciones`} className="hover:text-accent transition-colors"><T>Términos y Condiciones</T></Link></li>
              <li><Link href={`/${locale}/politica-de-cancelacion`} className="hover:text-accent transition-colors"><T>Política de Reembolsos, Cancelaciones y Devoluciones</T></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="vv-label text-accent mb-6"><T>Soporte</T></h4>
            <ul className="space-y-4 text-sm font-semibold text-white/70">
              <li className="flex items-start gap-3"><Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" /> hello@viajevivo.com.mx</li>
              <li className="flex items-start gap-3"><Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" /> +52 1 55 1708 4774</li>
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" /> AVENIDA COYOACAN 1878, PISO 14 DEP 1405 - A, COLONIA DEL VALLE BENITO JUÁREZ C.P. 03100 CIUDAD DE MEXICO</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/25 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-white/55">
          <p>© {new Date().getFullYear()} ViajeVivo. <T>Todos los derechos reservados.</T></p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 border border-accent/40 text-accent rounded-sm uppercase tracking-widest"><T>Pago seguro con Octano</T> <ArrowUpRight className="inline w-3 h-3" /></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
