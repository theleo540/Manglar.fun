import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import type { AppRoute } from "../config/routes";

/**
 * Antes, /profile y /dashboard se renderizaban solos (sin Navbar, sin
 * el fondo oscuro del Home) — por eso se veían "en blanco"/rotos. Este
 * wrapper les da el mismo fondo (#080808) y el mismo Navbar del resto
 * del sitio, para que se sientan parte de la misma app y no una
 * pantalla suelta.
 */
export function PageShell({
  navigate,
  children,
}: {
  navigate: (route: AppRoute) => void;
  children: ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar scrolled={scrolled} navigate={navigate} />
      {children}
      <Footer />
    </div>
  );
}
