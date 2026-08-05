import { useRef, useState } from "react";
import { Film, Clapperboard, Sparkles, Flame, Heart, Bookmark, Link2, MousePointerClick, ChevronLeft, ChevronRight } from "lucide-react";
import { useEcosystemActivity } from "@/hooks/useEcosystemActivity";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { AnimePreviewModal } from "@/web/anime";
import { HentaiPreviewModal } from "@/web/hentai";
import { MoviePreviewModal } from "@/web/peliculas";
import type { ProductActivity } from "@/types/activity";
import type { EcosystemAnimeItem, EcosystemMovieItem } from "@/web/shared/types";
import { cn } from "@/components/ui/utils";

const GOCUT_URL = "https://gocut.manglar.fun";

// Mismos dominios reales que ECOSYSTEM_PROJECTS (config/ecosystem.ts,
// footerUrl de manglaranime/manglarhentai/manglarpelis) -- se usan como
// `domain` del preview modal, igual que en el Hero.
const ANIME_URL = "https://anime.manglar.fun";
const HENTAI_URL = "https://hentai.manglar.fun";
const PELIS_URL = "https://manglarpelis.manglar.fun";

type Tab = "pelis" | "anime" | "hentai";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "pelis", label: "Películas", icon: <Clapperboard className="w-4 h-4" /> },
  { id: "anime", label: "Anime", icon: <Sparkles className="w-4 h-4" /> },
  { id: "hentai", label: "Hentai", icon: <Flame className="w-4 h-4" /> },
];

function toAnimeItem(itemId: string, title: string, posterUrl: string): EcosystemAnimeItem {
  // El preview modal solo necesita id/title/poster(/backdrop) — no
  // guardamos backdrop en la actividad, así que usamos el poster como
  // respaldo (mismo criterio que AnimePreviewModal ya usa internamente
  // cuando no hay backdropUrl).
  return { id: itemId, title, posterUrl, backdropUrl: posterUrl, type: null };
}

/**
 * ManglarPelis arma su item_id como "movie-<tmdbId>" / "tv-<tmdbId>"
 * (ver EcosystemMovieItem) — de ahí sacamos mediaType y tmdbId sin
 * pegarle otra vez al backend.
 */
function toMovieItem(itemId: string, title: string, posterUrl: string): EcosystemMovieItem {
  const [prefix, ...rest] = itemId.split("-");
  const mediaType: "movie" | "tv" = prefix === "tv" ? "tv" : "movie";
  const tmdbId = Number(rest.join("-")) || 0;
  return { id: itemId, tmdbId, mediaType, title, posterUrl, backdropUrl: posterUrl, rating: null };
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
      <span className="text-emerald-400">{icon}</span>
      <span className="text-sm font-semibold text-white font-mono">{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}

function Poster({ title, posterUrl, sub, onOpen }: { title: string; posterUrl: string; sub?: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex-shrink-0 w-[100px] sm:w-[120px] text-left group"
      title={`Ver "${title}"`}
    >
      <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#0d1117] border border-white/[0.06] group-hover:border-emerald-400/40 transition-colors">
        {posterUrl ? (
          <ImageWithFallback
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <Film className="w-6 h-6" />
          </div>
        )}
      </div>
      <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
        {title}
      </p>
      {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
    </button>
  );
}

/**
 * Fila horizontal con botones de deslizar (< / >) a los costados. Sin
 * esto la única forma de ver los posters que no entran en pantalla era
 * arrastrar con el mouse/dedo -- nada indicaba que se podía deslizar.
 */
function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <div className="relative group/row">
      <div ref={ref} className="flex gap-3 overflow-x-auto pb-1 scroll-smooth" style={{ scrollbarWidth: "none" }}>
        {children}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Deslizar hacia la izquierda"
        className="hidden sm:flex items-center justify-center absolute left-0 top-0 bottom-1 w-9 bg-gradient-to-r from-[#161B22] to-transparent text-white opacity-0 group-hover/row:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Deslizar hacia la derecha"
        className="hidden sm:flex items-center justify-center absolute right-0 top-0 bottom-1 w-9 bg-gradient-to-l from-[#161B22] to-transparent text-white opacity-0 group-hover/row:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="text-sm text-slate-500">{text}</p>;
}

function ActivityStats({ data }: { data: ProductActivity }) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      <MiniStat icon={<Heart className="w-3.5 h-3.5" />} label="likes" value={data.likesCount} />
      <MiniStat icon={<Bookmark className="w-3.5 h-3.5" />} label="en tu lista" value={data.listCount} />
      <MiniStat icon={<Film className="w-3.5 h-3.5" />} label="completados" value={data.completedCount} />
    </div>
  );
}

/**
 * Contenido de la pestaña Anime o Hentai: stats + filas con deslizar.
 * Al picarle a una tarjeta se abre el mismo preview modal que usa el
 * sitio real (y el Hero del home) en vez de mandar directo afuera --
 * desde ahí "Ver ahora" sí manda al título exacto.
 */
function ProductTabContent({ url, kind, data }: { url: string; kind: "anime" | "hentai"; data: ProductActivity }) {
  const [preview, setPreview] = useState<EcosystemAnimeItem | null>(null);
  const hasActivity = data.continueWatching.length > 0 || data.likes.length > 0 || data.listCount > 0 || data.completedCount > 0;
  const PreviewModal = kind === "hentai" ? HentaiPreviewModal : AnimePreviewModal;

  return (
    <>
      <ActivityStats data={data} />

      {!hasActivity && <EmptyRow text="Todavía no tenés actividad acá." />}

      {data.continueWatching.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-medium text-slate-400 mb-2.5">Continuar viendo</p>
          <ScrollRow>
            {data.continueWatching.map((item) => (
              <Poster
                key={`${item.itemId}-${item.product}`}
                title={item.title}
                posterUrl={item.posterUrl}
                sub={item.totalEpisodes ? `Ep. ${item.episodesWatched}/${item.totalEpisodes}` : undefined}
                onOpen={() => setPreview(toAnimeItem(item.itemId, item.title, item.posterUrl))}
              />
            ))}
          </ScrollRow>
        </div>
      )}

      {data.likes.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-400 mb-2.5">Tus likes</p>
          <ScrollRow>
            {data.likes.map((item) => (
              <Poster
                key={`${item.itemId}-${item.product}`}
                title={item.title}
                posterUrl={item.posterUrl}
                onOpen={() => setPreview(toAnimeItem(item.itemId, item.title, item.posterUrl))}
              />
            ))}
          </ScrollRow>
        </div>
      )}

      {preview && <PreviewModal item={preview} domain={url} onClose={() => setPreview(null)} />}
    </>
  );
}

/** Contenido de la pestaña Películas — mismo patrón, pero con el preview modal de ManglarPelis. */
function PelisTabContent({ data }: { data: ProductActivity }) {
  const [preview, setPreview] = useState<EcosystemMovieItem | null>(null);
  const hasActivity = data.continueWatching.length > 0 || data.likes.length > 0 || data.listCount > 0 || data.completedCount > 0;

  return (
    <>
      <ActivityStats data={data} />

      {!hasActivity && <EmptyRow text="Todavía no tenés actividad acá." />}

      {data.continueWatching.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-medium text-slate-400 mb-2.5">Continuar viendo</p>
          <ScrollRow>
            {data.continueWatching.map((item) => (
              <Poster
                key={`${item.itemId}-${item.product}`}
                title={item.title}
                posterUrl={item.posterUrl}
                sub={item.mediaType === "tv" ? "Serie" : "Película"}
                onOpen={() => setPreview(toMovieItem(item.itemId, item.title, item.posterUrl))}
              />
            ))}
          </ScrollRow>
        </div>
      )}

      {data.likes.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-400 mb-2.5">Tus likes</p>
          <ScrollRow>
            {data.likes.map((item) => (
              <Poster
                key={`${item.itemId}-${item.product}`}
                title={item.title}
                posterUrl={item.posterUrl}
                onOpen={() => setPreview(toMovieItem(item.itemId, item.title, item.posterUrl))}
              />
            ))}
          </ScrollRow>
        </div>
      )}

      {preview && <MoviePreviewModal item={preview} domain={PELIS_URL} onClose={() => setPreview(null)} />}
    </>
  );
}

/**
 * Recopilación real de actividad del usuario en los productos del
 * ecosistema (ManglarAnime, ManglarHentai, ManglarPelis, GoCut), leída
 * directo de Supabase, unificada bajo un solo selector de pestañas en
 * vez de secciones apiladas.
 */
export function EcosystemActivitySection({ ownerEmail }: { ownerEmail: string }) {
  const { activity, loading } = useEcosystemActivity(ownerEmail);
  const [tab, setTab] = useState<Tab>("pelis");

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] p-6 space-y-4">
        <div className="h-9 w-64 rounded-lg bg-white/[0.04] animate-pulse" />
        <div className="h-40 rounded-xl bg-white/[0.04] animate-pulse" />
      </div>
    );
  }

  if (!activity) return null;

  const { anime, hentai, pelis } = activity;
  const activeUrl = tab === "hentai" ? HENTAI_URL : tab === "pelis" ? PELIS_URL : ANIME_URL;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all",
                tab === t.id ? "bg-emerald-500 text-[#0D1117]" : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <a href={activeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:underline">
          Ir al sitio →
        </a>
      </div>

      {tab === "pelis" && <PelisTabContent data={pelis} />}
      {tab === "anime" && <ProductTabContent url={ANIME_URL} kind="anime" data={anime} />}
      {tab === "hentai" && <ProductTabContent url={HENTAI_URL} kind="hentai" data={hentai} />}
    </div>
  );
}

/** Sección de GoCut — separada de los catálogos de video porque no es contenido, son links propios. */
export function GocutActivitySection({ ownerEmail }: { ownerEmail: string }) {
  const { activity, loading } = useEcosystemActivity(ownerEmail);

  if (loading) {
    return <div className="h-40 rounded-2xl border border-white/[0.08] bg-[#161B22] animate-pulse" />;
  }

  if (!activity) return null;
  const { gocut } = activity;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">GoCut</h3>
        <a href={GOCUT_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:underline">
          Ir al sitio →
        </a>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <MiniStat icon={<Link2 className="w-3.5 h-3.5" />} label="links creados" value={gocut.linksCount} />
        <MiniStat icon={<MousePointerClick className="w-3.5 h-3.5" />} label="clicks totales" value={gocut.totalClicks} />
      </div>

      {gocut.links.length > 0 ? (
        <div className="space-y-2">
          {gocut.links.map((link) => (
            <a
              key={link.slug}
              href={`${GOCUT_URL}/${link.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-emerald-400/40 transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-sm text-emerald-400 font-mono truncate">gocut.link/{link.slug}</p>
                <p className="text-xs text-slate-500 truncate">{link.longUrl}</p>
              </div>
              <span className="flex-shrink-0 text-xs text-slate-400 font-mono">{link.clicks} clicks</span>
            </a>
          ))}
        </div>
      ) : (
        <EmptyRow text="Todavía no creaste ningún link." />
      )}
    </div>
  );
}