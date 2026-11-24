"use client";
import { useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Map, Wallet, UserCircle, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

export function Pricing() {
  const locale = useLocale();

  const features = [
    { icon: Map, title: "Ruta Inteligente", desc: "Itinerarios creados desde cero.", colSpan: "col-span-2 sm:col-span-1" },
    { icon: Wallet, title: "Ajuste de Presupuesto", desc: "Optimizamos cada centavo invertido.", colSpan: "col-span-2 sm:col-span-1" },
    { icon: UserCircle, title: "Asesor Asignado", desc: "Soporte 24/7 en tu viaje.", colSpan: "col-span-2" },
    { icon: ShieldCheck, title: "Transparencia Total", desc: "Sin cuotas ocultas (IVA inc.)", colSpan: "col-span-2" },
  ];

  return (
    <section id="precios" className="py-24 lg:py-32 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 border-2 border-foreground/10 bg-card rounded-none vv-offset-shadow-sm">
              <span className="w-2.5 h-2.5 bg-accent rotate-45 animate-pulse" />
              <span className="vv-label text-foreground"><T>Modelo Dinámico</T></span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-foreground">
              <T>Tu viaje.</T><br/>
              <T>Tu ritmo.</T><br/>
              <span className="vv-highlight text-primary"><T>Cero plantillas.</T></span>
            </h2>

            <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
              <T>Sabemos que ningún viajero es igual. Por eso destruimos los paquetes prefabricados y construimos rutas basándonos puramente en lo que te inspira.</T>
            </p>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {features.map((feat, i) => (
                <div key={i} className={`bg-card rounded-none p-6 border-2 border-foreground/10 vv-offset-shadow-sm hover:border-primary hover:bg-primary/5 transition-all group ${feat.colSpan}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-none bg-primary text-white flex items-center justify-center group-hover:bg-accent group-hover:text-foreground transition-colors">
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <span className="vv-label text-muted-foreground/50">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-1"><T>{feat.title}</T></h3>
                  <p className="text-sm font-medium text-muted-foreground"><T>{feat.desc}</T></p>
                </div>
              ))}

              <div className="col-span-2 mt-2">
                <Button asChild className="w-full rounded-none h-16 text-lg font-black bg-foreground text-background hover:bg-primary transition-all vv-offset-shadow group">
                  <Link href={`/${locale}/cotizar`}>
                    <T>Diseñar mi ruta</T>
                    <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
