import { Flame, ListOrdered } from "lucide-react";
import type { AnimeVerticalConfig } from "../config";
import { useAnimeTop10 } from "../hooks/useTop10";
import { AnimeCard } from "./AnimeCard";
import { ScrollableRow } from "../../../components/ScrollableRow";

/**
 * Sección "Anime" (o "Hentai") en la Home del hub: Top 10 y Tendencias,
 * con datos reales de anime1v-api. Recibe el config como prop porque el
 * mismo componente sirve para ManglarAnime y ManglarHentai — mismo
 * backend, mismo contrato de /api/widget/top10, solo cambia
 * apiBaseUrl (ver web/anime/config.ts).
 *
 * Mismo patrón que <MoviesRow />: si el backend no responde, no se
 * pinta nada (nunca datos falsos).
 */
export function AnimeRow({
  config,
  title = "Anime",
  sectionId,
}: {
  config: AnimeVerticalConfig;
  title?: string;
  sectionId?: string;
}) {
  const { domain, top10, trending, checked } = useAnimeTop10(config);

  if (checked && top10.length === 0 && trending.length === 0) return null;

  return (
    <section id={sectionId} className="mb-10">
      {top10.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 px-6 md:px-12">
            <ListOrdered className="w-4 h-4 text-[#0be881]" />
            <h2 className="text-white font-bold text-base md:text-lg tracking-tight">Top 10 {title.toLowerCase()} hoy</h2>
          </div>
          <ScrollableRow>
            {top10.map((item) => (
              <AnimeCard key={item.id} item={item} domain={domain} />
            ))}
          </ScrollableRow>
        </div>
      )}

      {trending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4 px-6 md:px-12">
            <Flame className="w-4 h-4 text-[#0be881]" />
            <h2 className="text-white font-bold text-base md:text-lg tracking-tight">Recién agregado en {title}</h2>
          </div>
          <ScrollableRow>
            {trending.map((item) => (
              <AnimeCard key={item.id} item={item} domain={domain} />
            ))}
          </ScrollableRow>
        </div>
      )}
    </section>
  );
}
