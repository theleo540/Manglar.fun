import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { EcosystemStrip } from "../components/EcosystemStrip";
import { SportsRow } from "../web/futbol";
import { Footer } from "../components/Footer";
import type { AppRoute } from "../config/routes";

export function Home({ navigate }: { navigate: (route: AppRoute) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#080808] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar scrolled={scrolled} navigate={navigate} />
      <Hero />

      <div className="pt-8">
        <EcosystemStrip />
        <SportsRow title="Deportes" />

        {/*
          Cuando exista otro vertical real (ej. NBA), se agrega aquí
          su propio <SportsRow /> desde web/nba:

          <SportsRow title="NBA" />  (importado de "../web/nba")

          Nunca con datos inventados — si el vertical no tiene datos
          reales, su propio componente simplemente no se pinta.
        */}
      </div>

      <Footer />
    </div>
  );
}
