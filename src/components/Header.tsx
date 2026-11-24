"use client";
import { T } from "@/components/T";
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: <T>Inicio</T> },
  { href: "/experiencias", label: <T>Experiencias</T> },
  { href: "/cotizar", label: <T>Diseñar mi ruta</T> },
  { href: "/#contacto", label: <T>Contacto</T> },
];

export function Header() {
  const locale = useLocale();
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { cart, getItemCount } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    }).format(price);

  return (
    <>
      {/* Marca flotante: logotipo vectorial con el nombre ViajeVivo */}
      <div className={`fixed top-5 left-5 z-50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'}`}>
        <Link href={`/${locale}/`} className="block bg-card border-2 border-foreground/10 px-3 py-2 rounded-none vv-offset-shadow-sm hover:-translate-y-1 hover:border-primary transition-all">
          <img src="/logo-viajevivo.svg" alt="ViajeVivo" className="h-11 w-auto" />
        </Link>
      </div>

      {/* Botonera flotante */}
      <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'}`}>
        <div className="relative" onMouseEnter={() => setShowMiniCart(true)} onMouseLeave={() => setShowMiniCart(false)}>
          <Link href={`/${locale}/carrito`} className="relative w-12 h-12 rounded-none bg-card border-2 border-foreground/10 flex items-center justify-center vv-offset-shadow-sm hover:border-primary transition-colors">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-6 h-6 px-1 bg-accent text-foreground text-[11px] font-black rounded-sm flex items-center justify-center border-2 border-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          {showMiniCart && (
            <div className="absolute right-0 top-full mt-4 w-80 bg-card rounded-none border-2 border-foreground/10 overflow-hidden z-50 vv-offset-shadow">
              <div className="p-4 border-b-2 border-foreground/10 flex items-center justify-between">
                <h3 className="font-black text-sm"><T>Tu Itinerario</T></h3>
                <span className="vv-label text-primary">{cart.items.length}</span>
              </div>
              {cart.items.length === 0 ? (
                <div className="p-8 text-center text-sm font-semibold text-muted-foreground flex flex-col items-center gap-3">
                  <ShoppingCart className="w-8 h-8 opacity-25" />
                  <T>Aún no hay aventuras</T>
                </div>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto p-3">
                    {cart.items.slice(0, 3).map((item) => {
                      const miniImage = item.experience.images?.[0] || '/images/placeholder.jpg';
                      return (
                        <div key={`${item.packageId}-${item.date}`} className="p-2 mb-2 bg-background rounded-none border border-border">
                          <div className="flex gap-3 items-center">
                            <img src={miniImage} className="w-12 h-12 rounded-none object-cover" alt={item.experience.title} />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-extrabold truncate"><T>{item.experience.title}</T></h4>
                              <p className="text-xs font-medium text-muted-foreground">{item.people}p · <T>{item.levelName}</T></p>
                              <p className="text-sm font-black text-primary">{formatPrice(item.totalPrice)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 bg-background">
                    <Link href={`/${locale}/carrito`} className="block w-full py-3 bg-primary text-white hover:bg-foreground transition-colors text-center rounded-none text-sm font-extrabold">
                      <T>Ver Resumen</T>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="w-12 h-12 rounded-none bg-foreground text-background flex items-center justify-center vv-offset-shadow-sm hover:bg-primary hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="rounded-l-none border-l-4 border-l-accent bg-background px-8">
            <SheetTitle className="sr-only"><T>Menú de navegación</T></SheetTitle>
            <div className="flex flex-col gap-8 mt-28">
              {navLinks.map((link, idx) => {
                const href = link.href.startsWith("/#")
                  ? `/${locale}${link.href.replace('/#', '#')}`
                  : `/${locale}${link.href}`;
                return (
                  <Link key={link.href} href={href} className="group flex items-baseline gap-4 text-4xl font-black text-foreground hover:text-primary transition-colors">
                    <span className="vv-label text-accent">0{idx + 1}</span>
                    {link.label}
                    <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                );
              })}
            </div>
            <div className="absolute bottom-12 left-8 right-8 border-t-2 border-foreground/10 pt-6">
              <p className="vv-label text-muted-foreground mb-3"><T>Contacto Rápido</T></p>
              <a href="mailto:hello@viajevivo.com.mx" className="block text-lg font-black text-foreground hover:text-primary mb-2">hello@viajevivo.com.mx</a>
              <p className="text-sm font-medium text-muted-foreground">viajevivo.com.mx · Ciudad de México, MX</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
