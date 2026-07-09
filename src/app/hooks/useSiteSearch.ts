import { useMemo } from "react";
import { useEcosystemWidgets } from "@/web/registry";
import { useFutbolMatches } from "@/web/futbol/hooks/useMatches";
import { usePeliculasTop10 } from "@/web/peliculas/hooks/useTop10";

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
 *  - los widgets de cada vertical activa (registry.ts → fútbol y
 *    películas hoy, automático cuando se sume NBA)
 *  - los partidos reales de fútbol (home/away)
 *  - las películas/series reales de ManglarPelis (top 10 + tendencias)
 *
 * No inventa resultados: si no hay match real, `results` viene vacío
 * (la UI debe mostrar "sin resultados", nunca datos falsos).
 */
export function useSiteSearch(query: string) {
  const { widgets } = useEcosystemWidgets();
  const { domain, matches } = useFutbolMatches();
  const { domain: peliculasDomain, top10, trending } = usePeliculasTop10();

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

    // Top 10 y tendencias pueden traer el mismo título repetido entre
    // ambas listas — se deduplican por id para no mostrar dos veces.
    const seen = new Set<string>();
    const movieResults: SearchResult[] = [...top10, ...trending]
      .filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      })
      .map((m) => ({
        id: `movie:${m.id}`,
        label: m.title,
        meta: m.mediaType === "tv" ? "Serie · ManglarPelis" : "Película · ManglarPelis",
        href: peliculasDomain ? `${peliculasDomain}/?title=${m.id}` : "#peliculas",
      }));

    return [...widgetResults, ...matchResults, ...movieResults];
  }, [widgets, matches, domain, top10, trending, peliculasDomain]);

  const results = useMemo<SearchResult[]>(() => {
    const q = norm(query.trim());
    if (!q) return [];
    return allResults.filter(
      (r) => norm(r.label).includes(q) || norm(r.meta).includes(q)
    );
  }, [allResults, query]);

  return { results, hasQuery: query.trim().length > 0 };
}
