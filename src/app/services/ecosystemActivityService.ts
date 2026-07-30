import { supabase } from "@/lib/supabase";
import type { EcosystemActivity, GocutLinkItem, LikedItem, WatchedItem } from "@/types/activity";

const EMPTY: EcosystemActivity = {
  manglarpelis: { continueWatching: [], completedCount: 0, likes: [], likesCount: 0, listCount: 0 },
  gocut: { links: [], linksCount: 0, totalClicks: 0 },
};

/** Índice item_id::product -> datos de portada/título, para no pegarle 1 query por item. */
async function fetchMediaIndex(keys: { itemId: string; product: string }[]) {
  const index = new Map<string, { title: string; posterUrl: string; mediaType: string | null }>();
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

export const ecosystemActivityService = {
  /**
   * Trae la actividad real del usuario (owner_email) en ManglarPelis y
   * GoCut. Todo vive en el mismo proyecto de Supabase que el Hub, así
   * que se consulta directo — no hay API intermedia.
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

    const mediaKeys = [
      ...historyRows.map((r) => ({ itemId: r.item_id as string, product: r.product as string })),
      ...likeRows.map((r) => ({ itemId: r.item_id as string, product: r.product as string })),
    ];
    const mediaIndex = await fetchMediaIndex(mediaKeys);

    const continueWatching: WatchedItem[] = historyRows
      .filter((r) => r.status === "watching")
      .map((r) => {
        const meta = mediaIndex.get(`${r.item_id}::${r.product}`);
        const watched = Array.isArray(r.watched_episodes) ? (r.watched_episodes as unknown[]).length : 0;
        return {
          itemId: r.item_id as string,
          product: r.product as "anime" | "hentai",
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

    const completedCount = historyRows.filter((r) => r.status === "completed").length;

    const likes: LikedItem[] = likeRows.slice(0, 12).map((r) => {
      const meta = mediaIndex.get(`${r.item_id}::${r.product}`);
      return {
        itemId: r.item_id as string,
        product: r.product as "anime" | "hentai",
        title: meta?.title ?? "Sin título",
        posterUrl: meta?.posterUrl ?? "",
        createdAt: r.created_at as string,
      };
    });

    const gocutLinks: GocutLinkItem[] = (gocutRes.data ?? []).slice(0, 8).map((r) => ({
      slug: r.slug as string,
      longUrl: r.long_url as string,
      clicks: (r.clicks as number) ?? 0,
      createdAt: r.created_at as string,
    }));
    const totalClicks = (gocutRes.data ?? []).reduce((sum, r) => sum + ((r.clicks as number) ?? 0), 0);

    return {
      manglarpelis: {
        continueWatching,
        completedCount,
        likes,
        likesCount: likeRows.length,
        listCount: listRows.length,
      },
      gocut: {
        links: gocutLinks,
        linksCount: (gocutRes.data ?? []).length,
        totalClicks,
      },
    };
  },
};
