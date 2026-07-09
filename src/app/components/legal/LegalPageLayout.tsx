import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import type { AppRoute } from "@/config/routes";
import { ROUTES } from "@/config/routes";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  navigate: (route: AppRoute) => void;
  children: ReactNode;
}

/**
 * Layout compartido de las 4 páginas legales (Privacidad, Términos, Cookies,
 * DMCA). Mismo header/tipografía para las cuatro — cada página solo pasa
 * su título y contenido. Se monta dentro de PageShell, así que ya trae
 * Navbar + Footer del Hub.
 */
export function LegalPageLayout({ title, lastUpdated, navigate, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen px-6 pt-24 pb-20 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>

        <h1
          className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {title}
        </h1>
        <p className="text-xs text-white/35 mb-10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Última actualización: {lastUpdated}
        </p>

        <div className="prose-legal space-y-6 text-sm text-white/60 leading-relaxed [&_h2]:text-white/90 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-3 [&_li]:mb-1.5 [&_a]:text-[#0be881] [&_a]:hover:underline [&_strong]:text-white/80">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
