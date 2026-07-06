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
        <Zap className="w-3.5 h-3.5 text-[#0be881]" />
        <span
          className="text-white/35 text-[10px] font-medium tracking-[0.25em] uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Ecosistema Manglar
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {widgets.map((w) => (
          <EcosystemWidgetCard key={w.project} data={w} />
        ))}
      </div>
    </div>
  );
}
