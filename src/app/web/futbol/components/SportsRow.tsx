import { Trophy } from "lucide-react";
import { useFutbolMatches } from "../hooks/useMatches";
import { MatchCard } from "./MatchCard";
import { ScrollableRow } from "../../../components/ScrollableRow";

/**
 * Fila "Deportes" con partidos reales de fútbol. El equivalente para
 * NBA sería web/nba/components/SportsRow.tsx usando
 * web/nba/hooks/useMatches.ts — mismo layout, otro fetch.
 *
 * Usa <ScrollableRow> para el scroll horizontal: en móvil el swipe ya
 * funciona solo, pero en PC hacía falta el botón (antes no existía
 * ningún control ahí, por eso no se podía mover con mouse).
 */
export function SportsRow({ title = "Deportes" }: { title?: string }) {
  const { domain, matches, checked } = useFutbolMatches();

  if (checked && matches.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4 px-6 md:px-12">
        <Trophy className="w-4 h-4 text-[#0be881]" />
        <h2 className="text-white font-bold text-base md:text-lg tracking-tight">{title}</h2>
      </div>
      <ScrollableRow>
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} domain={domain} />
        ))}
      </ScrollableRow>
    </section>
  );
}
