/**
 * Actividad del usuario en los productos del ecosistema (ManglarAnime,
 * ManglarHentai, ManglarPelis, GoCut, ...) leída directo del mismo
 * proyecto de Supabase. Vive aparte de `profile.ts` porque no es
 * información editable — es un espejo de lo que ya existe en las tablas
 * de cada producto.
 *
 * NOTA sobre "pelis": el backend de ManglarPelis escribe en las mismas
 * tablas `manglarpelis_user_items` / `manglarpelis_watch_history` que
 * Anime/Hentai, pero su columna `product` no tiene la opción "movie"
 * todavía (CHECK solo permite anime/hentai) — cae en el default
 * "anime". Por eso NO usamos `product` para reconocer una película:
 * usamos el prefijo del `item_id` ("movie-"/"tv-" = ManglarPelis,
 * "anime-" = Anime o Hentai). Ver `bucketFor` en ecosystemActivityService.ts.
 */

export type EcosystemBucket = "anime" | "hentai" | "pelis";

export interface WatchedItem {
  itemId: string;
  product: EcosystemBucket;
  mediaType: "movie" | "tv" | null;
  status: "watching" | "completed";
  title: string;
  posterUrl: string;
  updatedAt: string;
  episodesWatched: number;
  totalEpisodes: number | null;
}

export interface LikedItem {
  itemId: string;
  product: EcosystemBucket;
  title: string;
  posterUrl: string;
  createdAt: string;
}

export interface GocutLinkItem {
  slug: string;
  longUrl: string;
  clicks: number;
  createdAt: string;
}

export interface ProductActivity {
  continueWatching: WatchedItem[];
  completedCount: number;
  likes: LikedItem[];
  likesCount: number;
  listCount: number;
}

export interface EcosystemActivity {
  anime: ProductActivity;
  hentai: ProductActivity;
  pelis: ProductActivity;
  gocut: {
    links: GocutLinkItem[];
    linksCount: number;
    totalClicks: number;
  };
}