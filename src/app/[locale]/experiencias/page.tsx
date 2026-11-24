"use client";
import { useLocale } from 'next-intl';
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { getCategories, getExperiences, formatPrice, type ExperienceWithPrice } from '@/lib/catalog';
import { MapPin, Search, ArrowUpRight, Compass } from "lucide-react";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";

function ExperienciasContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("categoria");
  const locale = useLocale();
  const experiences = getExperiences();
  const categories = getCategories();
  // `undefined` significa "usar el parámetro de la URL"; cualquier otro valor
  // es la selección explícita del usuario en los botones de filtro.
  const [categoryOverride, setCategoryOverride] = useState<string | null | undefined>(undefined);
  const selectedCategory = categoryOverride === undefined ? categoryParam : categoryOverride;
  const [searchTerm, setSearchTerm] = useState("");
  const phSearch = useT("Ej. Cenotes, Oaxaca...");

  const filteredExperiences = experiences.filter((exp) => {
    const matchesCategory = !selectedCategory || exp.categories?.slug === selectedCategory;
    const matchesSearch = !searchTerm ||
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="pt-32 pb-12 container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl">
          <p className="vv-label text-primary mb-5">02 / <T>Catálogo</T></p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6 leading-none">
            <T>Directorio de</T><br />
            <span className="vv-highlight text-primary"><T>Aventuras.</T></span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl">
            <T>Curaduría exclusiva de destinos. Filtra por tu estilo de viaje y descubre lugares que desafían lo ordinario.</T>
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          <aside className="w-full lg:w-1/4 lg:sticky lg:top-28 space-y-8">
            <div>
              <label className="vv-label text-muted-foreground mb-3 block ml-1"><T>Búsqueda</T></label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={phSearch}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 rounded-none bg-card border-2 border-foreground/10 font-bold text-foreground focus-visible:ring-primary w-full"
                />
              </div>
            </div>

            <div>
              <label className="vv-label text-muted-foreground mb-4 block ml-1"><T>Categorías</T></label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCategoryOverride(null)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-none text-sm font-extrabold transition-all border-2 ${
                    !selectedCategory
                      ? 'bg-primary text-white border-primary vv-offset-shadow-sm'
                      : 'bg-card text-muted-foreground border-foreground/10 hover:border-primary'
                  }`}
                >
                  <T>Mostrar Todo</T>
                  {!selectedCategory && <ArrowUpRight className="w-4 h-4" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryOverride(cat.slug)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-none text-sm font-extrabold transition-all text-left border-2 ${
                      selectedCategory === cat.slug
                        ? 'bg-primary text-white border-primary vv-offset-shadow-sm'
                        : 'bg-card text-muted-foreground border-foreground/10 hover:border-primary'
                    }`}
                  >
                    <T>{cat.name}</T>
                    {selectedCategory === cat.slug && <ArrowUpRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="w-full lg:w-3/4">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-[2px] flex-1 bg-border"></div>
              <span className="vv-label text-muted-foreground px-4">
                {filteredExperiences.length} <T>Planes encontrados</T>
              </span>
              <div className="h-[2px] flex-1 bg-border"></div>
            </div>

            {filteredExperiences.length === 0 ? (
              <div className="text-center py-32 bg-card rounded-none border-2 border-foreground/10 flex flex-col items-center">
                <Compass className="w-16 h-16 text-primary/25 mb-6" />
                <h3 className="text-2xl font-black text-foreground mb-2"><T>Búsqueda sin resultados</T></h3>
                <p className="text-muted-foreground font-medium"><T>Intenta cambiar los filtros o elimina tu búsqueda actual.</T></p>
                <button onClick={() => { setSearchTerm(''); setCategoryOverride(null); }} className="mt-8 text-sm font-black text-primary underline underline-offset-4">
                  <T>Limpiar todos los filtros</T>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredExperiences.map((exp: ExperienceWithPrice) => {
                  const thumbImage = exp.images?.length > 0 ? exp.images[0] : '/images/placeholder.jpg';
                  return (
                    <Link key={exp.id} href={`/${locale}/experiencias/${exp.id}`} className="group block">
                      <div className="bg-card rounded-none overflow-hidden border-2 border-foreground/10 hover:border-primary hover:vv-offset-shadow-sm transition-all duration-300 flex flex-col sm:flex-row p-3 gap-6 items-center">
                        <div className="w-full sm:w-2/5 md:w-1/3 aspect-[4/3] sm:aspect-square md:aspect-[4/3] relative rounded-none overflow-hidden shrink-0">
                          <img src={thumbImage} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex-1 py-2 pr-4 flex flex-col w-full">
                          <div className="flex justify-between items-start mb-3 gap-4">
                            <span className="vv-label text-primary bg-primary/10 px-3 py-1.5 rounded-sm">
                              <T>{exp.categories?.name || "Catálogo"}</T>
                            </span>
                            <div className="text-right shrink-0">
                              <p className="text-xl md:text-2xl font-black text-foreground leading-none">{formatPrice(exp.displayPrice)}</p>
                              <p className="vv-label text-muted-foreground mt-1"><T>IVA incluido</T></p>
                            </div>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                            <T>{exp.title}</T>
                          </h3>
                          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4 text-primary" /> <T>{exp.location}</T>
                          </div>
                          <div className="mt-auto flex items-center justify-between border-t-2 border-foreground/10 pt-4">
                            <span className="text-xs font-black text-foreground group-hover:text-primary underline underline-offset-4">
                              <T>Ver Detalles</T>
                            </span>
                            <div className="w-8 h-8 rounded-none bg-accent border-2 border-foreground flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ExperienciasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ExperienciasContent />
    </Suspense>
  );
}
