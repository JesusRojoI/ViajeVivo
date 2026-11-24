"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { T } from "@/components/T";

interface LegalPageProps {
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export function LegalPage({ title, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-40 pb-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-1/3 lg:sticky lg:top-40 h-fit">
              <p className="vv-label text-primary mb-5">ViajeVivo / <T>Legal</T></p>
              <h1 className="text-5xl md:text-6xl font-black mb-8 text-foreground leading-[1.05]">{title}</h1>
              <div className="hidden lg:block border-l-4 border-accent pl-6 space-y-4">
                <p className="vv-label text-muted-foreground mb-6"><T>Contenido</T></p>
                {sections.map((section, idx) => (
                  <a key={idx} href={`#sec-${idx}`} className="flex gap-3 text-sm font-bold text-muted-foreground hover:text-primary transition-colors line-clamp-1">
                    <span className="text-accent">{String(idx + 1).padStart(2, '0')}</span>
                    {section.heading}
                  </a>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              <div className="space-y-14">
                {sections.map((section, index) => (
                  <div key={index} id={`sec-${index}`} className="scroll-mt-32 bg-card border-2 border-foreground/10 rounded-none p-8 vv-offset-shadow-sm">
                    <div className="flex items-baseline gap-4 mb-6">
                      <span className="vv-label text-accent">{String(index + 1).padStart(2, '0')}</span>
                      <h2 className="text-2xl md:text-3xl font-black text-foreground">{section.heading}</h2>
                    </div>
                    <p className="text-foreground/75 font-medium text-base leading-[1.9] whitespace-pre-line">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
