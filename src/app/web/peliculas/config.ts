/**
 * Config del vertical Películas (ManglarPelis).
 *
 * Mismo criterio que web/futbol/config.ts: el backend real (donde vive
 * /api/widget y /api/widget/top10) puede NO ser el mismo dominio que
 * el frontend (el link al que se manda al usuario). El link real
 * siempre viene en el campo `domain` de la respuesta del propio
 * /api/widget — nunca se arma a mano aquí.
 *
 * Ajusta apiBaseUrl cuando despliegues el backend de ManglarPelis
 * (hoy local en :3001; cuando esté en Azure/Render/lo que sea, cambia
 * esta URL — igual que WC2026Streams).
 */
export const PELICULAS_CONFIG = {
  slug: "manglarpelis",
  label: "ManglarPelis",
  apiBaseUrl: "http://localhost:3001",
};
