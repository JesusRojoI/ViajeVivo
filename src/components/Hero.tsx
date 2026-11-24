"use client";
import { T } from "@/components/T";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MapPin, MoveRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from 'next-intl';

const destinations = ["Tepoztlán", "Riviera Maya", "Oaxaca", "Bacalar", "Pueblos Mágicos", "Yucatán"];

export function Hero() {
  const locale = useLocale();
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-24 overflow-hidden bg-background">
      <div className="absolute inset-0 vv-dot-grid [mask-image:radial-gradient(ellipse_75%_55%_at_50%_45%,#000_60%,transparent_100%)]" />
      <div className="absolute -left-24 top-1/3 w-72 h-72 bg-accent/25 rounded-full blur-[90px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          <div className="flex flex-col items-start text-left space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-card border-2 border-foreground/10 rounded-none vv-offset-shadow-sm">
              <span className="w-2.5 h-2.5 bg-accent rotate-45" />
              <span className="vv-label text-foreground"><T>Redefiniendo el viaje</T></span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-[6.5rem] font-black leading-[0.94] text-foreground">
              <T>Despierta tu</T>
              <br />
              <span className="vv-highlight text-primary"><T>Aventura</T></span>
            </h1>

            <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-lg leading-relaxed">
              <T>Rutas vibrantes y logística impecable para sumergirte en los lugares más asombrosos de México. Tú eliges el destino, nosotros trazamos el mapa.</T>
            </p>

            <Button asChild size="lg" className="h-14 px-8 rounded-none bg-primary hover:bg-foreground text-white font-extrabold text-base vv-offset-shadow-light hover:vv-offset-shadow transition-all group">
              <Link href={`/${locale}/#contacto`}>
                <T>Hablar con un experto</T>
                <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Collage editorial: bloques duros y sombra desplazada */}
          <div className="relative h-[520px] md:h-[600px] w-full hidden md:block animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="absolute top-8 left-10 right-0 bottom-8 bg-primary/10 rounded-none" />
            <div className="absolute top-0 left-0 w-[74%] h-[76%] rounded-none overflow-hidden border-2 border-foreground/15 vv-offset-shadow z-10">
              <img src="/images/hero-main.jpg" alt="Destino principal" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-[48%] h-[46%] rounded-none overflow-hidden border-2 border-foreground/15 vv-offset-shadow z-20">
              <img src="/images/hero-relax.jpg" alt="Relax" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-6 right-2 z-30 bg-accent border-2 border-foreground rounded-none px-5 py-4 vv-offset-shadow-sm rotate-0">
              <p className="vv-label text-foreground/70"><T>Siguiente Parada</T></p>
              <p className="text-lg font-black text-foreground"><T>¡Vamos!</T></p>
            </div>
            <div className="absolute bottom-10 left-0 z-30 bg-card border-2 border-foreground/10 rounded-none px-4 py-3 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm font-extrabold"><T>México</T> <MoveRight className="inline w-4 h-4 text-accent" /> <T>Mundo</T></span>
            </div>
          </div>
        </div>
      </div>

      {/* Banda de destinos en movimiento */}
      <div className="absolute bottom-0 left-0 right-0 border-y-2 border-foreground/10 bg-card/60 py-4 overflow-hidden">
        <div className="flex w-max vv-marquee-track">
          {[0, 1].map((round) => (
            <div key={round} className="flex shrink-0">
              {destinations.map((d) => (
                <span key={`${round}-${d}`} className="flex items-center gap-8 pr-8 vv-label text-muted-foreground">
                  <T>{d}</T> <span className="text-accent text-lg">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
