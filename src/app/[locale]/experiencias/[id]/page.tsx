"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { getExperienceById, getPackagesByExperienceId, formatPrice } from "@/lib/catalog";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { Minus, Plus, MapPin, Sparkles, Fingerprint, ArrowUpRight } from "lucide-react";

const MIN_DATE = new Date(Date.now() + 86400000).toISOString().split("T")[0];

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const { addToCart } = useCart();
  const phDestino = useT("Escribe tu destino...");

  const experience = getExperienceById(Number(params.id));
  const packages = experience ? getPackagesByExperienceId(experience.id) : [];
  const [selectedDate, setSelectedDate] = useState("");
  const [people, setPeople] = useState(1);
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");
  const [isAdding, setIsAdding] = useState(false);
  const [destination, setDestination] = useState("");

  const selectedPackage = packages.find(p => p.id === (selectedPackageId || packages[0]?.id)) || packages[0];
  const info = experience?.important_info as { codigo?: string; requiere_destino?: boolean } | undefined;
  const requiereDestino = info?.requiere_destino === true;
  const isFormValid = Boolean(selectedDate && selectedPackage && (!requiereDestino || destination.trim() !== ""));

  const handleAddToCart = () => {
    if (!experience || !selectedPackage || !isFormValid) return;
    setIsAdding(true);
    addToCart({
      packageId: selectedPackage.id,
      experience,
      date: selectedDate,
      people,
      levelName: selectedPackage.package_name,
      pricePerPerson: Number(selectedPackage.price),
      destino_elegido: requiereDestino ? destination : undefined,
    } as Parameters<typeof addToCart>[0]);
    setTimeout(() => { setIsAdding(false); router.push("/carrito"); }, 400);
  };

  if (!experience) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-black"><T>Experiencia no encontrada</T></h1>
          <Button asChild className="rounded-none bg-primary"><Link href={`/${locale}/experiencias`}><T>Ver experiencias</T></Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="relative h-[62vh] w-full overflow-hidden border-b-4 border-accent">
        <img src={experience.images?.[0] || '/images/placeholder.jpg'} alt={experience.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <main className="container mx-auto px-6 md:px-12 pb-24 -mt-14 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10 pt-6">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-card border-2 border-foreground/10 px-4 py-2 rounded-none text-xs font-black uppercase tracking-widest">
                  <MapPin className="w-4 h-4 text-primary" /> <T>{experience.location}</T>
                </div>
                {info?.codigo && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-accent border-2 border-foreground rounded-none text-xs font-black uppercase tracking-widest">
                    <Fingerprint className="w-4 h-4" /> {info.codigo}
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.05]"><T>{experience.title}</T></h1>
            </div>
            <article className="pt-6 border-t-2 border-foreground/10">
              <p className="text-xl md:text-2xl leading-relaxed font-medium text-muted-foreground"><T>{experience.description}</T></p>
            </article>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-card border-2 border-foreground/10 rounded-none p-8 vv-offset-shadow">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-black text-lg uppercase tracking-widest"><T>Reservar</T></h3>
              </div>

              {packages.length > 1 && (
                <div className="mb-6">
                  <select
                    className="w-full h-14 px-4 bg-background border-2 border-foreground/10 rounded-none font-bold focus:ring-2 focus:ring-primary outline-none"
                    value={selectedPackageId || packages[0].id}
                    onChange={(e) => setSelectedPackageId(Number(e.target.value))}
                  >
                    {packages.map(pkg => <option key={pkg.id} value={pkg.id}><T>{pkg.package_name}</T></option>)}
                  </select>
                </div>
              )}

              {selectedPackage && (
                <div className="mb-8 p-6 bg-background rounded-none border-2 border-foreground/10">
                  <p className="vv-label text-muted-foreground mb-2"><T>Total por viajero</T></p>
                  <p className="text-4xl font-black text-primary">{formatPrice(selectedPackage.price)}</p>
                  <p className="vv-label text-muted-foreground mt-2"><T>IVA incluido</T></p>
                </div>
              )}

              <div className="space-y-4">
                {requiereDestino && (
                  <Input placeholder={phDestino} value={destination} onChange={(e) => setDestination(e.target.value)} className="h-14 rounded-none border-2 border-foreground/10" />
                )}
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={MIN_DATE} className="h-14 rounded-none border-2 border-foreground/10" />
                <div className="flex items-center justify-between bg-background border-2 border-foreground/10 rounded-none h-14 px-4">
                  <span className="font-extrabold text-sm"><T>Viajeros</T></span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setPeople(Math.max(1, people - 1))}><Minus className="w-4 h-4" /></button>
                    <span className="font-black text-lg w-8 text-center">{people}</span>
                    <button onClick={() => setPeople(people + 1)}><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
                <Button
                  className="w-full h-16 rounded-none font-black uppercase tracking-widest bg-primary hover:bg-foreground transition-all text-white vv-offset-shadow-light group"
                  onClick={handleAddToCart}
                  disabled={!isFormValid || isAdding}
                >
                  <T>Confirmar Reserva</T>
                  <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
