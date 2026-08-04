/**
 * Config del vertical Anime (ManglarAnime).
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
