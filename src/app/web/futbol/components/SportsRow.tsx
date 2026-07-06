import { Trophy } from "lucide-react";
import { useFutbolMatches } from "../hooks/useMatches";
import { MatchCard } from "./MatchCard";

/**
 * Fila "Deportes" con partidos reales de fútbol. El equivalente para
 * NBA sería web/nba/components/SportsRow.tsx usando
 * web/nba/hooks/useMatches.ts — mismo layout, otro fetch.
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
      <div className="flex gap-3 overflow-x-auto px-6 md:px-12 pb-2" style={{ scrollbarWidth: "none" }}>
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} domain={domain} />
        ))}
      </div>
    </section>
  );
}
