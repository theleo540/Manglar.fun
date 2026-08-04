/**
 * Config de los verticales Anime (ManglarAnime) y Hentai (ManglarHentai).
 *
 * OJO: son el MISMO backend (anime1v-api), deployado dos veces con un
 * .env distinto cada uno (ver .env.example de ese repo: ANIME_SITE_URL
 * + WIDGET_PROVIDER). Por eso acá también comparten forma — un solo
 * `AnimeVerticalConfig` con dos instancias — en vez de duplicar
 * hooks/componentes como en web/futbol vs web/peliculas (que sí son
 * proyectos distintos de verdad).
 *
 * Todo lo que puede cambiar (URL del backend) sale de variables de
 * entorno VITE_* con un fallback al deploy real actual, para que un
 * cambio de dominio/instancia sea solo tocar el .env del hub, sin
 * tocar código. Igual que apiBaseUrl en web/futbol y web/peliculas: el
 * link al que se manda al usuario NUNCA se arma a mano acá — siempre
 * viene en el campo `domain` de la respuesta de /api/widget del propio
 * backend.
 */
export interface AnimeVerticalConfig {
  slug: string;
  label: string;
  apiBaseUrl: string;
}

export const ANIME_CONFIG: AnimeVerticalConfig = {
  slug: "manglaranime",
  label: "ManglarAnime",
  apiBaseUrl:
    import.meta.env.VITE_ANIME_API_URL ||
    "https://anime1v-api-gkagbgeqdjauchcu.canadacentral-01.azurewebsites.net",
};

// ManglarHentai usa el mismo codebase (anime1v-api) en otra instancia
// (WIDGET_PROVIDER=hentaila en ese deploy). "para después": no se monta
// en el Home todavía (ver pages/Home.tsx), pero ya queda listo — solo
// hay que descomentar <AnimeRow config={HENTAI_CONFIG} .../> ahí.
export const HENTAI_CONFIG: AnimeVerticalConfig = {
  slug: "manglarhentai",
  label: "ManglarHentai",
  apiBaseUrl: import.meta.env.VITE_HENTAI_API_URL || "https://anime1v-api-iynf.onrender.com",
};
