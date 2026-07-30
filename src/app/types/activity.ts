/**
 * Actividad del usuario en los productos del ecosistema (ManglarPelis,
 * GoCut, ...) leída directo del mismo proyecto de Supabase. Vive aparte
 * de `profile.ts` porque no es información editable — es un espejo de
 * lo que ya existe en las tablas de cada producto.
 */

export interface WatchedItem {
  itemId: string;
  product: "anime" | "hentai";
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
  product: "anime" | "hentai";
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

export interface EcosystemActivity {
  manglarpelis: {
    continueWatching: WatchedItem[];
    completedCount: number;
    likes: LikedItem[];
    likesCount: number;
    listCount: number;
  };
  gocut: {
    links: GocutLinkItem[];
    linksCount: number;
    totalClicks: number;
  };
}
