import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Experiences } from "@/components/Experiences";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  await params;
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Experiences />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
