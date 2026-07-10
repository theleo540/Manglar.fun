import { motion } from "motion/react";
import { ArrowRight, Film, Trophy } from "lucide-react";
import type { EcosystemWidgetResponse } from "./types";
import { getExternalLinkTarget } from "../../utils/linkTarget";

/**
 * Tarjeta del EcosystemStrip. No sabe nada de fútbol, NBA, etc — solo
 * pinta lo que trae un /api/widget. Cada vertical (web/futbol,
 * web/nba, web/peliculas...) es quien sabe pedir su propio widget;
 * esta card solo lo muestra. El ícono y el gradiente cambian según
 * `project` — si se agrega un vertical nuevo, se suma aquí un caso más.
 *
 * Visualmente comparte lenguaje con components/common/Banner.tsx
 * (gradiente diagonal + patrón radial + ícono en chip) para que el
 * bloque "Ecosistema Manglar" se sienta al mismo nivel que el resto
 * del hub en vez de una fila de chips planos.
 */
const PROJECT_ICONS: Record<string, typeof Trophy> = {
  manglarpelis: Film,
};

const PROJECT_GRADIENTS: Record<string, string> = {
  manglarpelis: "linear-gradient(135deg, #0d1117 0%, #7e22ce 130%)",
};
const DEFAULT_GRADIENT = "linear-gradient(135deg, #0d1117 0%, #0f6e3f 130%)";

export function EcosystemWidgetCard({ data }: { data: EcosystemWidgetResponse }) {
  const Icon = PROJECT_ICONS[data.project] || Trophy;
  const gradient = PROJECT_GRADIENTS[data.project] || DEFAULT_GRADIENT;
  const isLive = data.status === "live";

  return (
    <motion.a
      href={data.domain}
      target={getExternalLinkTarget()}
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className="relative flex-shrink-0 w-[210px] snap-start sm:w-full sm:flex-shrink overflow-hidden rounded-2xl border border-white/10 hover:border-[#0be881]/40 transition-colors group"
      style={{ background: gradient }}
    >
      {/* Patrón decorativo, igual que Banner.tsx */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, white 0%, transparent 35%), radial-gradient(circle at 90% 80%, white 0%, transparent 30%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-start gap-3 px-4 py-4">
        <div className="relative shrink-0 w-11 h-11 rounded-xl bg-black/25 backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
          {isLive && (
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-red-500 ring-2 ring-black/40 animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          {isLive ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-300 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              En vivo ahora
            </span>
          ) : (
            <span className="text-[9px] font-medium uppercase tracking-wider text-white/40 mb-0.5 block">
              {data.status === "scheduled" ? "Próximamente" : "Disponible"}
            </span>
          )}
          <p className="text-white text-sm font-bold truncate leading-tight">{data.title}</p>
          <p className="text-white/60 text-[11px] truncate mt-0.5">{data.description}</p>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/10 bg-black/15 px-4 py-2">
        <span className="text-white/50 text-[10px] font-medium truncate">{data.domain.replace(/^https?:\/\//, "")}</span>
        <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#0be881] group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </motion.a>
  );
}