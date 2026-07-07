import { Info, Play, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useFutbolWidget } from "../hooks/useWidget";
import { FlagHalf } from "../../shared/FlagHalf";
import { CountdownTimer } from "./CountdownTimer";

/**
 * <WidgetFutbol /> — banner grande del vertical Fútbol (WC2026 Streams)
 * para el Hero de manglar.fun. Usa useFutbolWidget() por dentro, así
 * que siempre muestra el partido real (o el estado vacío real si no
 * hay nada en vivo/programado).
 *
 * Este es el patrón a copiar para el próximo vertical, ej:
 *   web/nba/components/WidgetNba.tsx
 *   usando web/nba/hooks/useWidget.ts (mismo shape, otro apiBaseUrl)
 * con el mismo layout de FlagHalf/CTA, solo cambiando textos y colores
 * si aplica.
 */
export function WidgetFutbol() {
  const [muted, setMuted] = useState(true);
  const { data, loading } = useFutbolWidget();

  const isLive = data?.status === "live";
  const match = data?.card;
  const domain = data?.domain || "https://wc2026streams.manglar.fun";

  const title = match ? `${match.home} vs ${match.away}` : "WC2026 Streams";
  const meta = match
    ? new Date(match.utcDate).toLocaleString("es-MX", {
        weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
      })
    : "Fútbol en vivo · Mundial 2026";
  const description = match
    ? "Sigue el partido en vivo con chat en tiempo real, contador de espectadores y transmisión en HD."
    : loading
      ? "Cargando información en vivo..."
      : "Aún no hay partido en vivo o programado. Vuelve pronto para ver la transmisión.";

  return (
    <section className="relative w-full h-[88vh] min-h-[520px] overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-black to-black" />

      {/* mismo patrón de NextMatchCard.tsx (WC2026): banderas/escudos en diagonal */}
      {match && (
        <div className="absolute inset-0 opacity-60">
          <FlagHalf
            image={match.homeCrest}
            name={match.home}
            clipPath="polygon(0 0, 100% 0, 0 100%)"
            emojiAlign="left"
          />
          <FlagHalf
            image={match.awayCrest}
            name={match.away}
            clipPath="polygon(100% 0, 100% 100%, 0 100%)"
            emojiAlign="right"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-[#0be881]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute inset-0 flex flex-col justify-end pb-28 px-6 md:px-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-[#0be881] text-[11px] font-black tracking-[0.22em] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              WC2026 STREAMS
            </span>
            {isLive && (
              <>
                <span className="w-px h-3 bg-white/30" />
                <span className="flex items-center gap-1.5 bg-red-600/90 text-white text-[9px] font-black tracking-[0.15em] uppercase px-2 py-1 rounded-sm animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  EN VIVO
                </span>
              </>
            )}
          </div>

          <h1
            className="text-white text-5xl md:text-7xl font-black leading-none tracking-tight mb-3 uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {title}
          </h1>

          <p
            className="text-white/50 text-xs font-medium tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {meta}
          </p>

          {match && !isLive && (
            <div className="mb-6 max-w-sm">
              <CountdownTimer targetDate={match.utcDate} />
            </div>
          )}

          <p className="text-white/65 text-sm md:text-base leading-relaxed mb-8 max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`${domain}/en-vivo`}
              className="flex items-center gap-2 bg-[#0be881] hover:bg-[#0be881]/85 text-black font-bold text-sm px-7 py-3 rounded transition-all hover:shadow-[0_0_28px_rgba(11,232,129,0.45)] active:scale-95"
            >
              <Play className="w-4 h-4 fill-black" />
              Ver Ahora
            </a>
            <a
              href={domain}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/18 backdrop-blur-sm text-white font-semibold text-sm px-6 py-3 rounded border border-white/20 hover:border-white/35 transition-all active:scale-95"
            >
              <Info className="w-4 h-4" />
              Ir al sitio
            </a>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
