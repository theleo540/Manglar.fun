import { ExternalLink, Film, Trophy } from "lucide-react";
import type { EcosystemWidgetResponse } from "./types";

/**
 * Tarjeta chica y genérica para el EcosystemStrip. No sabe nada de
 * fútbol, NBA, etc — solo pinta lo que trae un /api/widget. Cada
 * vertical (web/futbol, web/nba, web/peliculas...) es quien sabe pedir
 * su propio widget; esta card solo lo muestra. El ícono cambia según
 * `project` nada más para no mostrar un trofeo en algo que no es
 * deporte — si se agrega un vertical nuevo con ícono propio, se suma
 * aquí un caso más.
 */
const PROJECT_ICONS: Record<string, typeof Trophy> = {
  manglarpelis: Film,
};

export function EcosystemWidgetCard({ data }: { data: EcosystemWidgetResponse }) {
  const Icon = PROJECT_ICONS[data.project] || Trophy;

  return (
    <a
      href={data.domain}
      className="flex-shrink-0 flex items-center gap-3 bg-white/4 hover:bg-white/8 border border-white/8 hover:border-[#0be881]/35 rounded-xl px-4 py-3 transition-all group"
    >
      <div className="w-8 h-8 rounded-lg bg-[#0be881]/10 group-hover:bg-[#0be881]/18 flex items-center justify-center text-[#0be881] transition-colors flex-shrink-0 relative">
        <Icon className="w-4 h-4" />
        {data.status === "live" && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        )}
      </div>
      <div className="text-left min-w-0">
        <p className="text-white text-xs font-semibold truncate">{data.title}</p>
        <p className="text-white/35 text-[10px]">
          {data.status === "live" ? "En vivo ahora" : data.description}
        </p>
      </div>
      <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-[#0be881]/60 ml-1 flex-shrink-0 transition-colors" />
    </a>
  );
}
