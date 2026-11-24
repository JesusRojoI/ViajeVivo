"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { useCart } from "@/context/CartContext";
import { ArrowUpRight, FileText, User, Mail, Calendar, ShieldCheck } from "lucide-react";

export default function PagoFolioPage() {
  const router = useRouter();
  const locale = useLocale();
  const { addToCart } = useCart();

  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [folio, setFolio] = useState("");
  const [fecha, setFecha] = useState("");

  const btnConfirmar = useT("Añadir al carrito");
  const phFullName = useT("Nombre completo");

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonto(e.target.value.replace(/[^0-9.]/g, ''));
  };

  const isFormValid =
    parseFloat(monto) > 0 && nombre.trim().length > 0 && email.includes("@") && folio.trim().length > 0 && fecha !== "";

  const handleConfirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    const montoNumerico = parseFloat(monto);
    addToCart({
      packageId: 0,
      experience: {
        id: 0,
        title: "Aventura Personalizada",
        slug: "aventura-personalizada",
        description: `Pago de folio: ${folio}`,
        location: "Múltiples Destinos",
        images: ["/images/folio.jpg"],
        category_id: 0,
        important_info: { codigo: folio, requiere_destino: false },
      },
      levelName: "Personalizado",
      date: fecha,
      people: 1,
      pricePerPerson: montoNumerico,
    } as Parameters<typeof addToCart>[0]);
    sessionStorage.setItem("viajevivo_temp_contact", JSON.stringify({ nombre, email, folio }));
    router.push(`/${locale}/carrito`);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const inputClass = "h-14 bg-background border-2 border-foreground/10 focus-visible:ring-2 focus-visible:ring-primary rounded-none px-5 font-bold text-foreground placeholder:text-muted-foreground placeholder:font-medium w-full";
  const labelClass = "vv-label text-muted-foreground mb-3 flex items-center gap-2 ml-1";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        <section className="bg-foreground pt-24 pb-40 relative overflow-hidden rounded-b-none mx-2 lg:mx-4 mt-4">
          <div className="absolute inset-0 opacity-20">
            <img src="/images/folio.jpg" className="w-full h-full object-cover" alt="ViajeVivo" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-transparent" />
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[130px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-background/10 border border-background/25 rounded-none mb-6">
              <FileText className="w-4 h-4 text-accent" />
              <span className="vv-label text-background"><T>Servicios Privados</T></span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-background mb-6">
              <T>Pago de</T> <span className="vv-highlight text-accent"><T>Folio</T></span>
            </h1>
            <p className="text-lg text-background/65 font-medium max-w-2xl mx-auto">
              <T>Procesamiento seguro para itinerarios a la medida y servicios exclusivos de ViajeVivo. Ingresa los detalles de tu folio para proceder al checkout.</T>
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-3xl relative z-20 pb-24 -mt-24">
          <div className="bg-card rounded-none border-2 border-foreground/10 vv-offset-shadow p-8 md:p-12">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b-2 border-foreground/10">
              <div className="w-12 h-12 bg-accent border-2 border-foreground rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-foreground"><T>Detalles de la Reserva</T></h2>
                <p className="text-muted-foreground font-medium text-sm"><T>Tus datos están protegidos y encriptados.</T></p>
              </div>
            </div>

            <form onSubmit={handleConfirmarReserva} className="space-y-8">
              <div className="bg-background rounded-none p-6 md:p-8 border-2 border-foreground/10 focus-within:border-primary transition-all">
                <label className="vv-label text-muted-foreground mb-2 block"><T>Monto Acordado (MXN + IVA)</T></label>
                <div className="flex items-center mt-2">
                  <span className="text-4xl md:text-5xl font-black text-muted-foreground mr-3">$</span>
                  <Input type="text" value={monto} onChange={handleMontoChange} placeholder="0.00" required className="border-none bg-transparent p-0 text-4xl md:text-5xl font-black text-foreground focus-visible:ring-0 h-auto placeholder:text-muted-foreground/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                <div>
                  <label className={labelClass}><User className="w-4 h-4 text-primary" /> <T>Nombre</T></label>
                  <Input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder={phFullName} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Mail className="w-4 h-4 text-primary" /> <T>Correo</T></label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="correo@ejemplo.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><FileText className="w-4 h-4 text-primary" /> <T>Folio</T></label>
                  <Input type="text" value={folio} onChange={(e) => setFolio(e.target.value.toUpperCase())} required placeholder="Ej: EXP-001" className={`${inputClass} uppercase tracking-wider`} />
                </div>
                <div>
                  <label className={labelClass}><Calendar className="w-4 h-4 text-primary" /> <T>Fecha de Inicio</T></label>
                  <Input type="date" value={fecha} min={minDateStr} onChange={(e) => setFecha(e.target.value)} required className={inputClass} />
                </div>
              </div>

              <div className="pt-8 mt-8 border-t-2 border-foreground/10">
                <button type="submit" disabled={!isFormValid} className="w-full h-16 bg-primary hover:bg-foreground text-white font-black rounded-none vv-offset-shadow-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group">
                  <span className="text-sm uppercase tracking-widest">{btnConfirmar}</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
