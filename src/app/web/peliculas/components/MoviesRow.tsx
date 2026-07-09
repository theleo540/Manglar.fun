import { Flame, ListOrdered } from "lucide-react";
import { usePeliculasTop10 } from "../hooks/useTop10";
import { MovieCard } from "./MovieCard";
import { ScrollableRow } from "../../../components/ScrollableRow";

/**
 * Sección "Películas" en la Home del hub: Top 10 y Tendencias, con
 * datos reales de ManglarPelis (TMDB vía su backend). Mismo patrón que
 * <SportsRow /> en web/futbol — si el backend no responde, no se
 * pinta nada (nunca datos falsos).
 */
export function MoviesRow() {
  const { domain, top10, trending, checked } = usePeliculasTop10();

  if (checked && top10.length === 0 && trending.length === 0) return null;

  return (
    <section id="peliculas" className="mb-10">
      {top10.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 px-6 md:px-12">
            <ListOrdered className="w-4 h-4 text-[#0be881]" />
            <h2 className="text-white font-bold text-base md:text-lg tracking-tight">Top 10 películas hoy</h2>
          </div>
          <ScrollableRow>
            {top10.map((item) => (
              <MovieCard key={item.id} item={item} domain={domain} />
            ))}
          </ScrollableRow>
        </div>
      )}

      {trending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4 px-6 md:px-12">
            <Flame className="w-4 h-4 text-[#0be881]" />
            <h2 className="text-white font-bold text-base md:text-lg tracking-tight">Tendencias ahora</h2>
          </div>
          <ScrollableRow>
            {trending.map((item) => (
              <MovieCard key={item.id} item={item} domain={domain} />
            ))}
          </ScrollableRow>
        </div>
      )}
    </section>
  );
}
