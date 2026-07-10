import { Zap } from "lucide-react";
import { useEcosystemWidgets } from "../web/registry";
import { EcosystemWidgetCard } from "../web/shared/EcosystemWidgetCard";

/**
 * Fila horizontal con una tarjeta por cada vertical real (fútbol hoy;
 * NBA/películas cuando existan). Si un vertical no responde, no
 * aparece — nunca se muestra un placeholder falso.
 */
export function EcosystemStrip() {
  const { widgets, checked } = useEcosystemWidgets();

  if (checked && widgets.length === 0) return null;

  return (
    <div id="ecosistema" className="px-6 md:px-12 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-[#0be881]" />
        <span
          className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Ecosistema Manglar
        </span>
      </div>
      <div
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 sm:grid sm:grid-flow-col sm:auto-cols-fr sm:overflow-visible"
        style={{ scrollbarWidth: "none" }}
      >
        {widgets.map((w) => (
          <EcosystemWidgetCard key={w.project} data={w} />
        ))}
      </div>
    </div>
  );
}