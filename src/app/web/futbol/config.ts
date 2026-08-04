/**
 * Config del vertical Fútbol (ManglarFutbol).
 *
 * Cuando armes web/nba/config.ts, es este mismo archivo pero con los
 * datos de NBA: su propio backend en Azure (o donde sea) y su slug.
 */
export const FUTBOL_CONFIG = {
  slug: "manglarfutbol",
  label: "ManglarFutbol",
  // Backend real (Azure) — aquí vive /api/widget y /api/widget/matches.
  // El link al que se manda al usuario NO es esta URL — ese viene en
  // el campo `domain` de la respuesta del propio /api/widget.
  // Configurable por VITE_FUTBOL_API_URL, con fallback al deploy real
  // actual (mismo criterio que web/peliculas y web/anime).
  apiBaseUrl:
    import.meta.env.VITE_FUTBOL_API_URL ||
    "https://manglarfutbol-api-gjamc2dtapbsddak.southcentralus-01.azurewebsites.net",
};