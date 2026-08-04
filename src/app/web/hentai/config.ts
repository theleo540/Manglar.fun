/**
 * Config del vertical Hentai (ManglarHentai).
 *
 * Mismo backend que ManglarAnime (anime1v-api), deployado aparte
 * (WIDGET_PROVIDER=hentaila ahí) -- ver web/anime/config.ts para el
 * mismo criterio. Vive en su propia carpeta (en vez de vivir metido a
 * mano dentro de otro archivo) para que sea un vertical real y
 * descubrible del Hub, con su propia URL configurable por
 * VITE_HENTAI_API_URL.
 */
import type { AnimeVerticalConfig } from "../anime/config";

export const HENTAI_CONFIG: AnimeVerticalConfig = {
  slug: "manglarhentai",
  label: "ManglarHentai",
  apiBaseUrl:
    import.meta.env.VITE_HENTAI_API_URL || "https://anime1v-api-iynf.onrender.com",
};
