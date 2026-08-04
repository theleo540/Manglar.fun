/**
 * Config del vertical Películas (ManglarPelis).
 *
 * Mismo criterio que web/futbol/config.ts: el backend real (donde vive
 * /api/widget y /api/widget/top10) NO es el mismo dominio que el
 * frontend (el link al que se manda al usuario). El link real siempre
 * viene en el campo `domain` de la respuesta del propio /api/widget —
 * nunca se arma a mano aquí.
 *
 * apiBaseUrl = backend en Azure App Service. El frontend real vive en
 * manglarpelis.manglar.fun (eso lo maneja el propio backend/.env de
 * ManglarPelis, no este archivo).
 */
export const PELICULAS_CONFIG = {
  slug: "manglarpelis",
  label: "ManglarPelis",
  // Configurable por VITE_PELICULAS_API_URL, con fallback al deploy
  // real actual (mismo criterio que web/futbol y web/anime).
  apiBaseUrl:
    import.meta.env.VITE_PELICULAS_API_URL ||
    "https://manglarpelis-api-bfbharh2c0cueuhj.canadaeast-01.azurewebsites.net",
};