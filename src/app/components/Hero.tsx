import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Info, Star } from "lucide-react";
import { useFutbolWidget } from "../web/futbol";
import { FlagHalf } from "../web/shared/FlagHalf";
import { CountdownTimer } from "../web/futbol/components/CountdownTimer";
import { usePeliculasTop10, MoviePreviewModal } from "../web/peliculas";
import { useAnimeTop10, AnimePreviewModal, ANIME_CONFIG } from "../web/anime";
import { useHentaiTop10, HentaiPreviewModal } from "../web/hentai";
import type { EcosystemMovieItem, EcosystemAnimeItem, EcosystemWidgetResponse } from "../web/shared/types";

type Slide =
  | { kind: "futbol" }
  | { kind: "movie"; item: EcosystemMovieItem; domain: string }
  | { kind: "anime"; item: EcosystemAnimeItem; domain: string }
  | { kind: "hentai"; item: EcosystemAnimeItem; domain: string };

const AUTOPLAY_MS = 7000;

/**
 * Hero grande de la home (mismo alto que el hero de ManglarPelis/
 * ManglarAnime: 100svh) que va rotando entre TODOS los verticales
 * reales con contenido -- fútbol (si hay partido en vivo/programado),
 * películas, anime y hentai -- en vez de mostrar solo fútbol y dejar
 * un fallback chico cuando no hay partido. Nunca debe quedar vacío
 * mientras algún vertical tenga datos reales.
 */
export function Hero() {
  const { data: futbolData, loading: futbolLoading } = useFutbolWidget();
  const { domain: peliculasDomain, top10: peliculasTop10, trending: peliculasTrending, checked: peliculasChecked } =
    usePeliculasTop10();
  const { domain: animeDomain, top10: animeTop10, trending: animeTrending, checked: animeChecked } =
    useAnimeTop10(ANIME_CONFIG);
  const { domain: hentaiDomain, top10: hentaiTop10, trending: hentaiTrending, checked: hentaiChecked } =
    useHentaiTop10();

  // Igual que el Home real de cada vertical: el hero prioriza el Top 10
  // (trae `rank`, así se puede mostrar el mismo badge "TOP N" que en la
  // página real) y solo cae a "tendencias" si ese vertical no tiene Top 10.
  const movies = peliculasTop10.length > 0 ? peliculasTop10 : peliculasTrending;
  const animeItems = animeTop10.length > 0 ? animeTop10 : animeTrending;
  const hentaiItems = hentaiTop10.length > 0 ? hentaiTop10 : hentaiTrending;

  const hasMatch = !!futbolData?.card;

  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = [];
    if (hasMatch) list.push({ kind: "futbol" });

    const movieSlides: Slide[] = movies.slice(0, 4).map((item) => ({ kind: "movie", item, domain: peliculasDomain }));
    const animeSlides: Slide[] = animeItems.slice(0, 4).map((item) => ({ kind: "anime", item, domain: animeDomain }));
    const hentaiSlides: Slide[] = hentaiItems.slice(0, 4).map((item) => ({ kind: "hentai", item, domain: hentaiDomain }));

    // Se intercalan para que no salgan varias películas seguidas y
    // luego varios animes -- variedad real desde el primer ciclo.
    const max = Math.max(movieSlides.length, animeSlides.length, hentaiSlides.length);
    for (let i = 0; i < max; i++) {
      if (movieSlides[i]) list.push(movieSlides[i]);
      if (animeSlides[i]) list.push(animeSlides[i]);
      if (hentaiSlides[i]) list.push(hentaiSlides[i]);
    }
    return list;
  }, [hasMatch, movies, animeItems, hentaiItems, peliculasDomain, animeDomain, hentaiDomain]);

  const [index, setIndex] = useState(0);
  const [previewMovie, setPreviewMovie] = useState<EcosystemMovieItem | null>(null);
  const [previewAnime, setPreviewAnime] = useState<{ item: EcosystemAnimeItem; domain: string; kind: "anime" | "hentai" } | null>(
    null
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  useEffect(() => {
    if (slides.length <= 1 || previewMovie || previewAnime) return;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, previewMovie, previewAnime]);

  const allChecked = !futbolLoading && peliculasChecked && animeChecked && hentaiChecked;
  const slide = slides[index];

  // Todavía no sabemos si hay algo que mostrar -- evita el parpadeo de
  // "no hay nada" mientras los 4 verticales terminan de responder.
  if (!allChecked && slides.length === 0) {
    return <section className="relative w-full bg-black" style={{ height: "100svh", minHeight: 640 }} />;
  }

  // Los 4 verticales respondieron y ninguno tiene nada real que mostrar
  // -- no se inventa contenido, se muestra un estado vacío honesto.
  if (allChecked && slides.length === 0) {
    return (
      <section
        className="relative w-full bg-black flex items-center justify-center px-6 text-center"
        style={{ height: "60svh", minHeight: 420 }}
      >
        <p className="text-white/40 text-sm">El ecosistema no tiene contenido en vivo en este momento.</p>
      </section>
    );
  }

  if (!slide) return null;

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 640 }}>
      <div className="absolute inset-0">
        {slide.kind === "futbol" && futbolData?.card ? (
          <div className="absolute inset-0 opacity-60 bg-black">
            <FlagHalf image={futbolData.card.homeCrest} name={futbolData.card.home} clipPath="polygon(0 0, 100% 0, 0 100%)" emojiAlign="left" />
            <FlagHalf image={futbolData.card.awayCrest} name={futbolData.card.away} clipPath="polygon(100% 0, 100% 100%, 0 100%)" emojiAlign="right" />
          </div>
        ) : (
          slides.map((s, i) => {
            if (s.kind === "futbol") return null;
            return (
              <img
                key={`${s.kind}-${s.item.id}`}
                src={s.item.backdropUrl}
                alt={s.item.title}
                // blur-sm + scale-105 solo para anime/hentai: mismo
                // tratamiento que sus propios Hero.tsx -- ese backdrop
                // viene en baja calidad y al estirarse a todo el ancho
                // del hero se nota pixelado; el blur lo disimula (el
                // scale-105 evita que se vea el borde blureado). Películas
                // (TMDB) sí trae backdrop de buena calidad, así que se
                // queda nítido, igual que en el Hero de ManglarPelis.
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                  s.kind === "anime" || s.kind === "hentai" ? "blur-sm scale-105" : ""
                }`}
                style={{ opacity: i === index ? 1 : 0 }}
              />
            );
          })
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.6) 40%, transparent 75%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.35) 32%, transparent 60%)" }}
        />
      </div>

      <div className="relative h-full flex flex-col justify-end pb-28 md:pb-36 px-4 md:px-16 max-w-2xl">
        {slide.kind === "futbol" && futbolData ? (
          <FutbolContent data={futbolData} />
        ) : slide.kind !== "futbol" ? (
          <SlideContent
            slide={slide}
            onPreview={() => {
              if (slide.kind === "movie") setPreviewMovie(slide.item);
              else setPreviewAnime({ item: slide.item, domain: slide.domain, kind: slide.kind });
            }}
          />
        ) : null}

        {slides.length > 1 && (
          <div className="flex items-center gap-1.5 mt-6">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === index ? 24 : 8,
                  background: i === index ? "#0be881" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {previewMovie && (
        <MoviePreviewModal item={previewMovie} domain={peliculasDomain} onClose={() => setPreviewMovie(null)} />
      )}
      {previewAnime &&
        (previewAnime.kind === "hentai" ? (
          <HentaiPreviewModal item={previewAnime.item} domain={previewAnime.domain} onClose={() => setPreviewAnime(null)} />
        ) : (
          <AnimePreviewModal item={previewAnime.item} domain={previewAnime.domain} onClose={() => setPreviewAnime(null)} />
        ))}
    </section>
  );
}

function FutbolContent({ data }: { data: EcosystemWidgetResponse }) {
  const match = data.card!;
  const isLive = data.status === "live";
  const domain = data.domain || "https://manglarfutbol.manglar.fun";
  const meta = new Date(match.utcDate).toLocaleString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[#0be881] text-[11px] font-black tracking-[0.22em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          MANGLARFUTBOL
        </span>
        {isLive && (
          <>
            <span className="w-px h-3 bg-white/30" />
            <span className="flex items-center gap-1.5 bg-red-600/90 text-white text-[9px] font-black tracking-[0.15em] uppercase px-2 py-1 rounded-sm animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              EN VIVO
            </span>
          </>
        )}
      </div>

      <h1 className="text-white text-5xl md:text-7xl font-black leading-none tracking-tight mb-3 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        {match.home} vs {match.away}
      </h1>
      <p className="text-white/50 text-xs font-medium tracking-[0.3em] uppercase mb-5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {meta}
      </p>

      {!isLive && (
        <div className="mb-6 max-w-sm">
          <CountdownTimer targetDate={match.utcDate} />
        </div>
      )}

      <p className="text-white/65 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
        Sigue el partido en vivo con chat en tiempo real, contador de espectadores y transmisión en HD.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`${domain}/en-vivo`}
          className="flex items-center gap-2 bg-[#0be881] hover:bg-[#0be881]/85 text-black font-bold text-sm px-7 py-3 rounded transition-all hover:shadow-[0_0_28px_rgba(11,232,129,0.45)] active:scale-95"
        >
          <Play className="w-4 h-4 fill-black" />
          Ver Ahora
        </a>
        <a
          href={domain}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/18 backdrop-blur-sm text-white font-semibold text-sm px-6 py-3 rounded border border-white/20 hover:border-white/35 transition-all active:scale-95"
        >
          <Info className="w-4 h-4" />
          Ir al sitio
        </a>
      </div>
    </>
  );
}

const KIND_LABEL: Record<"movie" | "anime" | "hentai", string> = {
  movie: "MANGLARPELIS",
  anime: "MANGLARANIME",
  hentai: "MANGLARHENTAI",
};

function SlideContent({
  slide,
  onPreview,
}: {
  slide: Extract<Slide, { kind: "movie" | "anime" | "hentai" }>;
  onPreview: () => void;
}) {
  return (
    <>
      {slide.item.rank && (
        <div className="absolute right-6 md:right-16 bottom-[220px] md:bottom-[260px] z-10 hidden sm:flex flex-col items-center select-none pointer-events-none whitespace-nowrap">
          <span className="text-xs md:text-sm font-bold tracking-widest text-[#0be881] mb-1">TOP 10</span>
          <span
            className="font-['Barlow_Condensed'] font-black leading-none text-white"
            style={{ fontSize: "clamp(4.5rem, 10vw, 8rem)", WebkitTextStroke: "2px rgba(255,255,255,0.9)", color: "#0a0a0a" }}
          >
            {slide.item.rank}
          </span>
        </div>
      )}

      <span
        className="text-[#0be881] text-[11px] font-black tracking-[0.22em] uppercase mb-5 block"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {KIND_LABEL[slide.kind]}
      </span>

      <h1 className="text-white text-5xl md:text-7xl font-black leading-none tracking-tight mb-3 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        {slide.item.title}
      </h1>

      {/* Mismo estilo de badge que MoviePreviewModal/AnimePreviewModal
          (bg-white/10 + rounded-sm) en vez de texto suelto en mayúsculas
          -- así la calificación/tipo se ve como una etiqueta real, no
          como un renglón de metadata perdido. */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {slide.kind === "movie" ? (
          slide.item.rating && (
            <span className="flex items-center gap-1 text-xs bg-white/10 text-white/80 px-2 py-1 rounded-sm">
              <Star size={12} className="text-[#0be881] fill-[#0be881]" />
              {slide.item.rating}
            </span>
          )
        ) : (
          slide.item.type && (
            <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-sm">{slide.item.type}</span>
          )
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onPreview}
          className="flex items-center gap-2 bg-[#0be881] hover:bg-[#0be881]/85 text-black font-bold text-sm px-7 py-3 rounded transition-all hover:shadow-[0_0_28px_rgba(11,232,129,0.45)] active:scale-95"
        >
          <Play className="w-4 h-4 fill-black" />
          Ver Ahora
        </button>
        <a
          href={slide.domain || "#"}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/18 backdrop-blur-sm text-white font-semibold text-sm px-6 py-3 rounded border border-white/20 hover:border-white/35 transition-all active:scale-95"
        >
          <Info className="w-4 h-4" />
          Ir al sitio
        </a>
      </div>
    </>
  );
}
