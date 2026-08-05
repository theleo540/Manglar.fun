import { supabase } from "@/lib/supabase";
import type { EcosystemActivity, EcosystemBucket, GocutLinkItem, LikedItem, ProductActivity, WatchedItem } from "@/types/activity";

const EMPTY_PRODUCT: ProductActivity = { continueWatching: [], completedCount: 0, likes: [], likesCount: 0, listCount: 0 };
const EMPTY: EcosystemActivity = {
  anime: { ...EMPTY_PRODUCT },
  hentai: { ...EMPTY_PRODUCT },
  pelis: { ...EMPTY_PRODUCT },
  gocut: { links: [], linksCount: 0, totalClicks: 0 },
};

/**
 * A qué producto pertenece un item. NO confiar en la columna `product`
 * de la fila para películas/series: el backend de ManglarPelis todavía
 * no manda `product: "movie"` (el CHECK de la tabla ni lo permite) y
 * cae en el default "anime". El `item_id` sí es confiable: ManglarPelis
 * siempre lo arma como "movie-<tmdbId>" o "tv-<tmdbId>" (ver
 * EcosystemMovieItem), mientras que Anime/Hentai usan "anime-<base64>".
 */
function bucketFor(itemId: string, product: string): EcosystemBucket {
  if (itemId.startsWith("movie-") || itemId.startsWith("tv-")) return "pelis";
  return product === "hentai" ? "hentai" : "anime";
}

interface MediaMeta {
  title: string;
  posterUrl: string;
  mediaType: string | null;
}

/** Índice item_id -> datos de portada/título para Anime/Hentai (tabla con product). */
async function fetchAnimeMediaIndex(keys: { itemId: string; product: string }[]) {
  const index = new Map<string, MediaMeta>();
  if (keys.length === 0) return index;

  const itemIds = [...new Set(keys.map((k) => k.itemId))];
  const { data, error } = await supabase
    .from("anime_media_views")
    .select("item_id, product, title, poster_url, media_type")
    .in("item_id", itemIds);

  if (error || !data) return index;
  for (const row of data) {
    index.set(`${row.item_id}::${row.product}`, {
      title: (row.title as string) || "Sin título",
      posterUrl: (row.poster_url as string) || "",
      mediaType: (row.media_type as string) ?? null,
    });
  }
  return index;
}

/**
 * Índice item_id -> datos de portada/título para películas/series de
 * ManglarPelis. Vive en `media_views` (la tabla vieja, sin columna
 * `product`) — es donde escribe ManglarPelis, a diferencia de Anime/
 * Hentai que migraron a `anime_media_views`.
 */
async function fetchPelisMediaIndex(itemIds: string[]) {
  const index = new Map<string, MediaMeta>();
  if (itemIds.length === 0) return index;

  const { data, error } = await supabase
    .from("media_views")
    .select("item_id, title, poster_url, media_type")
    .in("item_id", [...new Set(itemIds)]);

  if (error || !data) return index;
  for (const row of data) {
    index.set(row.item_id as string, {
      title: (row.title as string) || "Sin título",
      posterUrl: (row.poster_url as string) || "",
      mediaType: (row.media_type as string) ?? null,
    });
  }
  return index;
}

export const ecosystemActivityService = {
  /**
   * Trae la actividad real del usuario (owner_email) en ManglarAnime,
   * ManglarHentai, ManglarPelis y GoCut. Todo vive en el mismo proyecto
   * de Supabase que el Hub, así que se consulta directo — no hay API
   * intermedia.
   */
  async getActivity(ownerEmail: string): Promise<EcosystemActivity> {
    if (!ownerEmail) return EMPTY;
    const email = ownerEmail.toLowerCase();

    const [historyRes, itemsRes, gocutRes] = await Promise.all([
      supabase
        .from("manglarpelis_watch_history")
        .select("item_id, product, media_type, status, watched_episodes, total_episodes, updated_at")
        .eq("owner_email", email)
        .order("updated_at", { ascending: false }),
      supabase
        .from("manglarpelis_user_items")
        .select("item_id, product, kind, created_at")
        .eq("owner_email", email)
        .order("created_at", { ascending: false }),
      supabase
        .from("gocut_links")
        .select("slug, long_url, clicks, created_at")
        .eq("owner_email", email)
        .order("created_at", { ascending: false }),
    ]);

    const historyRows = historyRes.data ?? [];
    const itemRows = itemsRes.data ?? [];
    const likeRows = itemRows.filter((r) => r.kind === "like");
    const listRows = itemRows.filter((r) => r.kind === "list");

    const allRows = [...historyRows, ...likeRows];
    const pelisItemIds = allRows.filter((r) => bucketFor(r.item_id as string, r.product as string) === "pelis").map((r) => r.item_id as string);
    const animeHentaiKeys = allRows
      .filter((r) => bucketFor(r.item_id as string, r.product as string) !== "pelis")
      .map((r) => ({ itemId: r.item_id as string, product: r.product as string }));

    const [animeMediaIndex, pelisMediaIndex] = await Promise.all([
      fetchAnimeMediaIndex(animeHentaiKeys),
      fetchPelisMediaIndex(pelisItemIds),
    ]);

    function metaFor(itemId: string, product: string, bucket: EcosystemBucket): MediaMeta | undefined {
      return bucket === "pelis" ? pelisMediaIndex.get(itemId) : animeMediaIndex.get(`${itemId}::${product}`);
    }

    function buildProductActivity(bucket: EcosystemBucket): ProductActivity {
      const bucketHistory = historyRows.filter((r) => bucketFor(r.item_id as string, r.product as string) === bucket);
      const bucketLikes = likeRows.filter((r) => bucketFor(r.item_id as string, r.product as string) === bucket);
      const bucketList = listRows.filter((r) => bucketFor(r.item_id as string, r.product as string) === bucket);

      const continueWatching: WatchedItem[] = bucketHistory
        .filter((r) => r.status === "watching")
        .map((r) => {
          const meta = metaFor(r.item_id as string, r.product as string, bucket);
          const watched = Array.isArray(r.watched_episodes) ? (r.watched_episodes as unknown[]).length : 0;
          return {
            itemId: r.item_id as string,
            product: bucket,
            mediaType: (r.media_type as "movie" | "tv") ?? null,
            status: "watching",
            title: meta?.title ?? "Sin título",
            posterUrl: meta?.posterUrl ?? "",
            updatedAt: r.updated_at as string,
            episodesWatched: watched,
            totalEpisodes: (r.total_episodes as number) ?? null,
          };
        })
        .slice(0, 12);

      const completedCount = bucketHistory.filter((r) => r.status === "completed").length;

      const likes: LikedItem[] = bucketLikes.slice(0, 12).map((r) => {
        const meta = metaFor(r.item_id as string, r.product as string, bucket);
        return {
          itemId: r.item_id as string,
          product: bucket,
          title: meta?.title ?? "Sin título",
          posterUrl: meta?.posterUrl ?? "",
          createdAt: r.created_at as string,
        };
      });

      return {
        continueWatching,
        completedCount,
        likes,
        likesCount: bucketLikes.length,
        listCount: bucketList.length,
      };
    }

    const gocutLinks: GocutLinkItem[] = (gocutRes.data ?? []).slice(0, 8).map((r) => ({
      slug: r.slug as string,
      longUrl: r.long_url as string,
      clicks: (r.clicks as number) ?? 0,
      createdAt: r.created_at as string,
    }));
    const totalClicks = (gocutRes.data ?? []).reduce((sum, r) => sum + ((r.clicks as number) ?? 0), 0);

    return {
      anime: buildProductActivity("anime"),
      hentai: buildProductActivity("hentai"),
      pelis: buildProductActivity("pelis"),
      gocut: {
        links: gocutLinks,
        linksCount: (gocutRes.data ?? []).length,
        totalClicks,
      },
    };
  },
};