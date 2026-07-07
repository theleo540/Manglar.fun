import { useMemo } from "react";
import { useEcosystemWidgets } from "@/web/registry";
import { useFutbolMatches } from "@/web/futbol/hooks/useMatches";

export interface SearchResult {
  id: string;
  label: string;
  meta: string;
  href: string;
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Busca sobre datos reales del ecosistema:
 *  - los widgets de cada vertical activa (registry.ts → hoy solo fútbol,
 *    automático cuando se sumen NBA/Películas)
 *  - los partidos reales de fútbol (home/away)
 *
 * No inventa resultados: si no hay match real, `results` viene vacío
 * (la UI debe mostrar "sin resultados", nunca datos falsos).
 */
export function useSiteSearch(query: string) {
  const { widgets } = useEcosystemWidgets();
  const { domain, matches } = useFutbolMatches();

  const allResults = useMemo<SearchResult[]>(() => {
    const widgetResults: SearchResult[] = widgets.map((w) => ({
      id: `widget:${w.project}`,
      label: w.title,
      meta: w.description,
      href: w.domain || "#ecosistema",
    }));

    const matchResults: SearchResult[] = matches.map((m) => ({
      id: `match:${m.id}`,
      label: `${m.home} vs ${m.away}`,
      meta: m.isLive ? "En vivo" : "Próximo partido",
      href: domain ? `${domain}/partido/${m.id}` : "#ecosistema",
    }));

    return [...widgetResults, ...matchResults];
  }, [widgets, matches, domain]);

  const results = useMemo<SearchResult[]>(() => {
    const q = norm(query.trim());
    if (!q) return [];
    return allResults.filter(
      (r) => norm(r.label).includes(q) || norm(r.meta).includes(q)
    );
  }, [allResults, query]);

  return { results, hasQuery: query.trim().length > 0 };
}
