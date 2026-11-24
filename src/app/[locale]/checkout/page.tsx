"use client";

import { useLocale } from 'next-intl';
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { CheckCircle, User, FileText, Lock, CreditCard, ShieldCheck } from "lucide-react";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";

function CheckoutContent() {
  const { cart, clearCart } = useCart();
  const finalTotal = cart.total;
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [billingInfo, setBillingInfo] = useState({ pais: "", direccion: "", localidad: "", estado: "", codigo_postal: "" });
  const [addNotes, setAddNotes] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [cardInfo, setCardInfo] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const locale = useLocale();

  useEffect(() => {
    const savedData = sessionStorage.getItem("viajevivo_temp_contact");
    if (!savedData) return;
    let parsed: { nombre: string; email: string; folio: string } | null;
    try {
      parsed = JSON.parse(savedData);
    } catch {
      parsed = null;
    }
    sessionStorage.removeItem("viajevivo_temp_contact");
    if (!parsed) return;

    const { nombre, email, folio } = parsed;
    // Diferimos la actualización para no provocar renders en cascada desde el efecto.
    queueMicrotask(() => {
      setContactInfo(prev => ({ ...prev, firstName: nombre, email }));
      setOrderNotes(`Pago referente al Folio: ${folio}`);
      setAddNotes(true);
    });
  }, []);

  const phNombre = useT("Nombre ");
  const phApellidos = useT("Apellidos");
  const phEmail = useT("Email ");
  const phTelefono = useT("Teléfono ");
  const phPais = useT("País / Región ");
  const phDireccion = useT("Dirección completa (Calle y número) ");
  const phLocalidad = useT("Localidad / Ciudad ");
  const phEstado = useT("Región / Estado ");
  const phCP = useT("Código Postal ");
  const phTarjeta = useT("Número de tarjeta ");
  const phNombreTarjeta = useT("Nombre en la tarjeta ");
  const phFecha = useT("MM/AA ");
  const phCvv = useT("CVV ");
  const textProcesando = useT("Procesando pago...");
  const textPagar = useT("Pagar");
  const phNotas = useT("Ej: Alergias alimentarias, etc.");

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, contactInfo, billingInfo, orderNotes: addNotes ? orderNotes : null, cart, cardInfo, formattedTotal: formatPrice(finalTotal), manualFolioData: null }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Error procesando el pago");
      setShowSuccess(true);
      clearCart();
    } catch (error: unknown) {
      alert(`Error al procesar el pago: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid =
    Boolean(contactInfo.firstName && contactInfo.email && contactInfo.phone &&
    billingInfo.pais && billingInfo.direccion && billingInfo.localidad && billingInfo.estado && billingInfo.codigo_postal &&
    cardInfo.number.length >= 15 && cardInfo.name && cardInfo.expiry.length === 5 && cardInfo.cvv.length >= 3 &&
    cart.items.length > 0);

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardInfo({ ...cardInfo, expiry: val });
  };

  const inputClass = "h-14 bg-background border-2 border-foreground/10 focus-visible:ring-2 focus-visible:ring-primary rounded-none px-5 font-bold text-foreground placeholder:text-muted-foreground placeholder:font-medium";

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 pt-40 pb-24 flex items-center justify-center px-4">
          <div className="max-w-lg w-full text-center bg-card rounded-none border-2 border-foreground/10 vv-offset-shadow p-12">
            <div className="w-24 h-24 bg-accent border-2 border-foreground rounded-full flex items-center justify-center mx-auto mb-8 vv-offset-shadow-sm">
              <CheckCircle className="w-12 h-12 text-foreground" />
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4 text-foreground"><T>¡Pago Exitoso!</T></h1>
            <p className="text-muted-foreground font-medium mb-10 text-lg"><T>Tu transacción ha sido confirmada y tu aventura está lista.</T></p>
            <Button asChild className="w-full bg-primary hover:bg-foreground text-white font-black rounded-none h-16 text-lg">
              <Link href={`/${locale}/`}><T>Volver al Inicio</T></Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12">
            <p className="vv-label text-primary mb-4">03 / <T>Pago seguro</T></p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground"><T>Checkout</T></h1>
          </div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-card p-8 md:p-10 border-2 border-foreground/10 rounded-none vv-offset-shadow-sm">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-primary rounded-none"><User className="text-white w-5 h-5" /></div>
                  <T>Datos de Contacto</T>
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input value={contactInfo.firstName} onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })} placeholder={phNombre} required className={inputClass} />
                  <Input value={contactInfo.lastName} onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })} placeholder={phApellidos} className={inputClass} />
                  <Input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder={phEmail} required className={inputClass} />
                  <Input type="tel" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} placeholder={phTelefono} required className={inputClass} />
                </div>
              </div>

              <div className="bg-card p-8 md:p-10 border-2 border-foreground/10 rounded-none vv-offset-shadow-sm">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-primary rounded-none"><FileText className="text-white w-5 h-5" /></div>
                  <T>Dirección de Facturación</T>
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input placeholder={phPais} required value={billingInfo.pais} onChange={(e) => setBillingInfo({ ...billingInfo, pais: e.target.value })} className={`sm:col-span-2 ${inputClass}`} />
                  <Input placeholder={phDireccion} required value={billingInfo.direccion} onChange={(e) => setBillingInfo({ ...billingInfo, direccion: e.target.value })} className={`sm:col-span-2 ${inputClass}`} />
                  <Input placeholder={phLocalidad} required value={billingInfo.localidad} onChange={(e) => setBillingInfo({ ...billingInfo, localidad: e.target.value })} className={inputClass} />
                  <Input placeholder={phEstado} required value={billingInfo.estado} onChange={(e) => setBillingInfo({ ...billingInfo, estado: e.target.value })} className={inputClass} />
                  <Input placeholder={phCP} required value={billingInfo.codigo_postal} onChange={(e) => setBillingInfo({ ...billingInfo, codigo_postal: e.target.value })} className={inputClass} />
                </div>
                <div className="mt-10 pt-8 border-t-2 border-foreground/10">
                  <label className="flex items-center gap-4 cursor-pointer text-foreground font-bold text-sm">
                    <input type="checkbox" checked={addNotes} onChange={(e) => setAddNotes(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer" />
                    <T>Añadir nota al pedido (Opcional)</T>
                  </label>
                  {addNotes && (
                    <div className="mt-6">
                      <Textarea placeholder={phNotas} value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} className="bg-background border-2 border-foreground/10 min-h-[120px] font-medium text-foreground rounded-none px-5 py-4 resize-none" />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-foreground p-8 md:p-10 rounded-none relative overflow-hidden text-background vv-offset-shadow">
                <div className="absolute -top-24 -right-16 opacity-[0.04] pointer-events-none">
                  <CreditCard className="w-[420px] h-[420px]" />
                </div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                      <div className="p-2 bg-accent rounded-none"><CreditCard className="text-foreground w-5 h-5" /></div>
                      <T>Método de Pago</T>
                    </h2>
                    <div className="bg-card px-4 py-2 rounded-none flex items-center h-12">
                      <img src="/octano.png" alt="Powered by Octano" className="h-8 w-auto object-contain" />
                    </div>
                  </div>
                  <div className="grid gap-5 max-w-md">
                    <Input placeholder={phTarjeta} required maxLength={19} value={cardInfo.number} onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value.replace(/\D/g, '') })} className="bg-background/10 border-2 border-background/15 h-14 font-mono text-lg tracking-widest focus-visible:ring-accent rounded-none px-5 text-background placeholder:text-background/35" />
                    <Input placeholder={phNombreTarjeta} required value={cardInfo.name} onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value.toUpperCase() })} className="bg-background/10 border-2 border-background/15 h-14 font-bold focus-visible:ring-accent rounded-none px-5 text-background placeholder:text-background/35" />
                    <div className="grid grid-cols-2 gap-5">
                      <Input placeholder={phFecha} required maxLength={5} value={cardInfo.expiry} onChange={handleExpiryChange} className="bg-background/10 border-2 border-background/15 h-14 font-bold text-center focus-visible:ring-accent rounded-none text-background placeholder:text-background/35" />
                      <Input placeholder={phCvv} type="password" required maxLength={4} value={cardInfo.cvv} onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value.replace(/\D/g, '') })} className="bg-background/10 border-2 border-background/15 h-14 font-mono text-center tracking-widest focus-visible:ring-accent rounded-none text-background placeholder:text-background/35" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 justify-between border-t-2 border-background/15 pt-6">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
                        <p className="text-xs font-bold text-background/60 leading-tight"><T>Tus datos están protegidos y encriptados de extremo a extremo.</T></p>
                      </div>
                      <span className="vv-label text-accent"><T>Pago seguro con Octano</T></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-card p-8 lg:p-10 sticky top-32 border-2 border-foreground/10 rounded-none vv-offset-shadow">
                <h2 className="text-xl font-black mb-8 text-foreground border-b-2 border-accent pb-6"><T>Resumen de Compra</T></h2>
                <div className="space-y-6 mb-10">
                  {cart.items.length === 0 ? (
                    <p className="text-muted-foreground font-medium"><T>Tu carrito está vacío.</T></p>
                  ) : cart.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm items-start gap-4">
                      <span className="text-muted-foreground font-medium leading-relaxed">
                        <T>{item.experience.title}</T> <span className="font-black text-foreground block mt-1">x{item.people} <T>personas</T></span>
                      </span>
                      <span className="font-black text-foreground">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-foreground/10 pt-8">
                  <div className="flex justify-between items-end mb-8">
                    <span className="vv-label text-muted-foreground"><T>Total</T></span>
                    <div className="text-right">
                      <div className="text-3xl font-black text-primary">{formatPrice(finalTotal)}</div>
                      <div className="vv-label text-muted-foreground mt-1"><T>IVA incluido</T></div>
                    </div>
                  </div>
                  <Button type="submit" disabled={!isFormValid || isProcessing} className="w-full bg-primary hover:bg-foreground text-white font-black h-16 rounded-none vv-offset-shadow-light transition-all text-lg">
                    <Lock className="w-5 h-5 mr-3" />
                    {isProcessing ? textProcesando : `${textPagar} ${formatPrice(finalTotal)}`}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
