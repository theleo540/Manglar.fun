import { motion } from "motion/react";
import { usePeliculasTop10, MovieCard } from "../web/peliculas";
import { useAnimeTop10, AnimeCard } from "../web/anime";
import { ANIME_CONFIG } from "../web/anime/config";
import { ScrollableRow } from "./ScrollableRow";

/**
 * <WidgetFutbol /> solo tiene contenido real cuando hay un partido en
 * vivo o programado -- fuera de eso el Hero no debe quedar negro y
 * vacío. Este fallback rellena ese espacio con contenido real de los
 * otros verticales activos (Películas y Anime), usando exactamente las
 * mismas <MovieCard>/<AnimeCard> y los mismos hooks de top10 que ya
 * pintan sus carousels más abajo en el Home -- nada inventado, mismo
 * dato real, solo destacado arriba también.
 *
 * Si en el futuro hay más verticales con contenido real (NBA, etc.),
 * este es el lugar para sumarlos al mismo patrón.
 */
export function HeroEcosystemFallback() {
  const { domain: peliculasDomain, trending: movies } = usePeliculasTop10();
  const { domain: animeDomain, trending: animeItems } = useAnimeTop10(ANIME_CONFIG);

  const hasMovies = movies.length > 0;
  const hasAnime = animeItems.length > 0;

  return (
    <section className="relative w-full min-h-[520px] overflow-hidden bg-black pb-10">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-black" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-[#0be881]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative pt-28 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="px-6 md:px-12"
        >
          <span
            className="text-[#0be881] text-[11px] font-black tracking-[0.22em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ECOSISTEMA MANGLAR
          </span>
          <h1
            className="text-white text-4xl md:text-6xl font-black leading-none tracking-tight mt-3 mb-2 uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Sin partidos ahora. Míralo todo aquí.
          </h1>
          <p className="text-white/55 text-sm md:text-base max-w-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Mientras no hay fútbol en vivo o programado, esto es lo más visto en Películas y Anime del ecosistema.
          </p>
        </motion.div>

        {hasMovies && (
          <div className="mt-10">
            <h2 className="text-white/80 text-sm font-bold uppercase tracking-wide mb-3 px-6 md:px-12">
              Tendencia en Películas
            </h2>
            <ScrollableRow>
              {movies.slice(0, 8).map((item) => (
                <MovieCard key={item.id} item={item} domain={peliculasDomain} />
              ))}
            </ScrollableRow>
          </div>
        )}

        {hasAnime && (
          <div className="mt-8">
            <h2 className="text-white/80 text-sm font-bold uppercase tracking-wide mb-3 px-6 md:px-12">
              Tendencia en Anime
            </h2>
            <ScrollableRow>
              {animeItems.slice(0, 8).map((item) => (
                <AnimeCard key={item.id} item={item} domain={animeDomain} />
              ))}
            </ScrollableRow>
          </div>
        )}

        {!hasMovies && !hasAnime && (
          <div className="mt-10 text-white/40 text-sm px-6 md:px-12">Cargando contenido del ecosistema...</div>
        )}
      </div>
    </section>
  );
}
