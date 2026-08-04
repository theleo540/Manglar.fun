/**
 * Contrato que todo GET /api/widget de cualquier vertical (fútbol, NBA,
 * películas...) debe cumplir. No es específico de fútbol — es la forma
 * fija que espera el Hero, el EcosystemStrip, y cualquier <Widget*/>.
 */
export interface EcosystemWidgetCard {
  home: string;
  away: string;
  homeCrest?: string;
  awayCrest?: string;
  utcDate: string;
}

export interface EcosystemWidgetResponse {
  project: string;
  title: string;
  description: string;
  domain: string;
  status: "live" | "scheduled" | "idle";
  card: EcosystemWidgetCard | null;
}

/**
 * Contrato de un item de /api/widget/matches (partidos, funciones de
 * cine, juegos, lo que aplique por vertical).
 */
export interface EcosystemMatch {
  id: string;
  home: string;
  away: string;
  homeCrest?: string;
  awayCrest?: string;
  utcDate: string;
  isLive: boolean;
}

/**
 * Contrato de un item de /api/widget/top10 (películas/series). Mismo
 * criterio que EcosystemMatch para fútbol: forma fija que espera
 * cualquier <MovieCard> del hub, sin importar el vertical de origen.
 */
export interface EcosystemMovieItem {
  id: string; // `${mediaType}-${tmdbId}`, ej "movie-1234"
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterUrl: string;
  backdropUrl: string;
  rating: string | null;
  rank?: number; // solo en el Top 10
}

/**
 * Contrato de un item de /api/widget/top10 de anime1v-api (ManglarAnime /
 * ManglarHentai — mismo backend, dos deploys distintos). A diferencia de
 * EcosystemMovieItem, `id` no es un id numérico: es
 * "anime-<base64url(url)>" (ver src/utils/animeId.js del backend), el
 * mismo esquema que usa lib/animeId.ts en el frontend real para leer
 * `?title=<id>` — así "Ver ahora" en el hub no necesita ningún mapeo
 * intermedio, solo pasar el id tal cual.
 */
export interface EcosystemAnimeItem {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  type: string | null; // "Anime", "Película", "OVA"... lo que devuelva el proveedor
  rank?: number; // solo en el Top 10
}
