'use client';

import { T } from "@/components/T";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Loader2, ArrowUpRight, Plus, Minus, CheckCircle, AlertCircle } from "lucide-react";

const faqs = [
  {
    q: "¿Cómo realizo el pago de mi plan?",
    a: "Pagos seguros en línea con tarjeta. Las tarifas mostradas son finales (incluyen IVA) y se realizan en una sola exhibición."
  },
  {
    q: "¿Puedo solicitar un itinerario personalizado?",
    a: "Totalmente. Diseñamos estrategias a la medida analizando el destino, tamaño del grupo, días disponibles y el estilo de viaje que buscas."
  },
  {
    q: "¿Los planes funcionan para viajes en grupo o familia?",
    a: "Sí, adaptamos la flexibilidad de la ruta ya sea para viajeros solitarios, escapadas en pareja, tribus familiares o grupos grandes."
  },
  {
    q: "¿Qué pasa si necesito cambiar mi destino?",
    a: "Puedes notificar tu elección al momento de confirmar. Operamos en una amplia red de destinos a lo largo de toda la República Mexicana."
  },
  {
    q: "¿Tienen planes para viajeros solos?",
    a: "Claro que sí. Tenemos rutas pensadas para viajeros independientes, abarcando desde formatos económicos y de mochila hasta experiencias de inmersión comunitaria."
  }
];

export function Contact() {
  const locale = useLocale();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (window.location.hash === '#contacto') {
      const element = document.getElementById('contacto');
      if (element) setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONTACT", locale, ...formData, customerName: formData.name,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || errorData.error || "Fallo al enviar correo");
      }
      setShowSuccess(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error: unknown) {
      console.error("Error en Contacto:", error);
      setErrorMessage(error instanceof Error ? error.message : "Hubo un error al enviar tu mensaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-background border-t-2 border-foreground/10">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="vv-label text-primary mb-4">04 / <T>FAQ</T></p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4"><T>Preguntas Frecuentes</T></h2>
            <p className="text-muted-foreground font-medium mb-10 text-lg">
              <T>Resolvemos tus dudas principales para que solo te preocupes por hacer la maleta.</T>
            </p>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className={`border-2 rounded-none overflow-hidden transition-all ${openFaq === index ? 'border-primary bg-primary/5' : 'border-foreground/10 bg-background'}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-extrabold text-foreground pr-4"><T>{faq.q}</T></span>
                    {openFaq === index ? <Minus className="w-5 h-5 text-primary shrink-0" /> : <Plus className="w-5 h-5 text-muted-foreground shrink-0" />}
                  </button>
                  <div className={`px-5 overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-muted-foreground text-sm leading-relaxed"><T>{faq.a}</T></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showSuccess ? (
            <div className="bg-background rounded-none border-2 border-foreground/10 vv-offset-shadow p-10 md:p-14 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-20 h-20 bg-accent border-2 border-foreground rounded-full flex items-center justify-center mb-8 vv-offset-shadow-sm">
                <CheckCircle className="w-10 h-10 text-foreground" />
              </div>
              <h3 className="text-3xl font-black text-foreground mb-4"><T>¡Mensaje Enviado!</T></h3>
              <p className="text-muted-foreground font-medium mb-10 leading-relaxed max-w-md">
                <T>Gracias por contactarnos. Hemos recibido tu mensaje correctamente y nuestro equipo de soporte se comunicará contigo a la brevedad posible.</T>
              </p>
              <Button onClick={() => setShowSuccess(false)} variant="outline" className="h-12 px-8 rounded-none font-extrabold border-2 border-foreground/15 hover:bg-foreground hover:text-background">
                <T>Enviar otro mensaje</T>
              </Button>
            </div>
          ) : (
            <div className="bg-background rounded-none border-2 border-foreground/10 vv-offset-shadow p-8 md:p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-foreground mb-2"><T>Contactanos</T></h3>
                <p className="text-sm text-muted-foreground font-medium"><T>Cuéntanos sobre tu próximo viaje o solicita soporte.</T></p>
              </div>

              {errorMessage && (
                <div className="mb-8 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-none flex items-start gap-3 text-destructive font-semibold text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="vv-label text-muted-foreground ml-1"><T>Nombre</T></label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-12 bg-card border-2 border-foreground/10 rounded-none px-4 focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="vv-label text-muted-foreground ml-1"><T>Teléfono</T></label>
                    <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="h-12 bg-card border-2 border-foreground/10 rounded-none px-4 focus-visible:ring-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="vv-label text-muted-foreground ml-1"><T>Correo Electrónico</T></label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="h-12 bg-card border-2 border-foreground/10 rounded-none px-4 focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between ml-1">
                    <label className="vv-label text-muted-foreground"><T>Mensaje</T></label>
                    <span className="text-xs font-semibold text-muted-foreground">{formData.message.length}/180</span>
                  </div>
                  <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} maxLength={180} className="bg-card border-2 border-foreground/10 rounded-none px-4 py-3 resize-none focus-visible:ring-primary" />
                </div>
                <Button type="submit" disabled={!formData.name || isSubmitting} className="w-full h-14 rounded-none bg-primary hover:bg-foreground text-white font-black text-base group">
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <T>Enviar Solicitud</T>}
                  {!isSubmitting && <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t-2 border-foreground/10 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" /> hello@viajevivo.com.mx
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
