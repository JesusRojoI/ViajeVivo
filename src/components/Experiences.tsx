"use client";
import { useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles, Compass } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

export function Experiences() {
  const locale = useLocale();
  return (
    <section id="experiencias" className="py-24 lg:py-32 bg-primary/[0.035] border-b-2 border-foreground/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-3xl">
            <p className="vv-label text-primary mb-5">01 / <T>Gestión de Viajes</T></p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.02] text-foreground">
              <T>Recorre México con rutas</T><br />
              <span className="vv-highlight text-primary"><T>exclusivas e imborrables.</T></span>
            </h2>
          </div>
          <Button asChild variant="outline" className="rounded-none h-12 px-6 font-extrabold border-2 border-foreground/15 hover:bg-foreground hover:text-background transition-colors">
            <Link href={`/${locale}/experiencias`}><T>Ver todos los planes</T></Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Pieza destacada: bloque esmeralda con imagen lateral */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-none bg-primary text-white border-2 border-foreground vv-offset-shadow group">
            <div className="absolute inset-y-0 right-0 w-1/2 opacity-30 group-hover:opacity-45 transition-opacity">
              <img src="/images/featured-road.jpg" alt="Carretera" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-r from-primary via-primary/90 to-transparent pointer-events-none" />
            <div className="relative z-10 p-10 md:p-14 min-h-[400px] flex flex-col justify-end max-w-xl">
              <span className="vv-label bg-accent text-foreground w-fit px-3 py-1.5 rounded-sm mb-6"><T>Destacado</T></span>
              <h3 className="text-4xl md:text-5xl font-black mb-4 text-white"><T>Itinerarios a la medida</T></h3>
              <p className="text-white/80 font-medium mb-8 max-w-md leading-relaxed">
                <T>Escapadas exprés, rutas para mochileros y road trips familiares diseñados paso a paso para que tú solo disfrutes el camino.</T>
              </p>
              <Button asChild className="w-fit rounded-none bg-accent text-foreground hover:bg-white font-extrabold h-13 px-7">
                <Link href={`/${locale}/experiencias?categoria=itinerarios-viaje`}>
                  <T>Explorar itinerarios</T> <ArrowUpRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:gap-8">
            <Link href={`/${locale}/experiencias?categoria=experiencias-bienestar`} className="group flex-1">
              <div className="h-full bg-background border-2 border-foreground/10 rounded-none p-8 hover:border-primary hover:vv-offset-shadow-sm transition-all relative overflow-hidden flex flex-col justify-between">
                <Sparkles className="absolute -bottom-8 -right-6 w-36 h-36 text-accent/25 group-hover:scale-110 transition-transform" />
                <div className="relative">
                  <span className="vv-label text-muted-foreground">02</span>
                  <h3 className="text-3xl font-black mt-3 mb-3 text-foreground"><T>Bienestar & Spa</T></h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed"><T>Retiros de yoga, meditación sonora y temazcales tradicionales para reconectar cuerpo y mente.</T></p>
                </div>
                <div className="mt-8 flex items-center text-sm font-black text-primary relative">
                  <T>Descubrir</T> <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href={`/${locale}/experiencias?categoria=tours-locales`} className="group flex-1">
              <div className="h-full bg-background border-2 border-foreground/10 rounded-none p-8 hover:border-primary hover:vv-offset-shadow-sm transition-all relative overflow-hidden flex flex-col justify-between">
                <Compass className="absolute -bottom-8 -right-6 w-36 h-36 text-primary/10 group-hover:scale-110 transition-transform" />
                <div className="relative">
                  <span className="vv-label text-muted-foreground">03</span>
                  <h3 className="text-3xl font-black mt-3 mb-3 text-foreground"><T>Tours Locales</T></h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed"><T>Recorridos guiados por expertos en pueblos mágicos, zonas arqueológicas y circuitos gastronómicos.</T></p>
                </div>
                <div className="mt-8 flex items-center text-sm font-black text-primary relative">
                  <T>Descubrir</T> <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
