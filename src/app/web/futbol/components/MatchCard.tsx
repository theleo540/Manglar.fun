import { FlagHalf } from "../../shared/FlagHalf";
import type { EcosystemMatch } from "../../shared/types";

/**
 * Tarjeta landscape para el strip "Deportes" — un partido real de
 * fútbol. Mismo split diagonal que el Hero/FlagHalf para mantener
 * consistencia visual en todo el ecosistema.
 */
export function MatchCard({ match, domain }: { match: EcosystemMatch; domain: string }) {
  const dateLabel = new Date(match.utcDate).toLocaleString("es-MX", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  return (
    <a
      href={domain ? `${domain}/partido/${match.id}` : "#"}
      className="relative flex-shrink-0 w-[280px] md:w-[320px] h-[160px] md:h-[180px] rounded-xl overflow-hidden border border-white/10 hover:border-[#0be881]/40 transition-colors group"
    >
      <FlagHalf image={match.homeCrest} name={match.home} clipPath="polygon(0 0, 100% 0, 0 100%)" emojiAlign="left" />
      <FlagHalf image={match.awayCrest} name={match.away} clipPath="polygon(100% 0, 100% 100%, 0 100%)" emojiAlign="right" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/45" />

      <div
        className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wide ${
          match.isLive ? "bg-red-600 text-white" : "bg-[#0be881] text-black"
        }`}
      >
        {match.isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
        {match.isLive ? "En vivo" : "Próximo"}
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-3 text-center">
        <span className="text-white font-black text-sm md:text-base drop-shadow-lg truncate max-w-[45%]">{match.home}</span>
        <span className="text-white/60 text-xs mx-2 shrink-0">vs</span>
        <span className="text-white font-black text-sm md:text-base drop-shadow-lg truncate max-w-[45%]">{match.away}</span>
      </div>

      <div className="absolute bottom-2 left-0 right-0 text-center text-white/75 text-[11px] font-medium">
        {dateLabel}
      </div>
    </a>
  );
}
