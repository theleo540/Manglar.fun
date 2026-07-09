import { useState } from "react";
import type { EcosystemMovieItem } from "../../shared/types";
import { MoviePreviewModal } from "./MoviePreviewModal";

/**
 * Tarjeta poster de película/serie real (TMDB vía ManglarPelis). Click
 * abre <MoviePreviewModal> — igual que en ManglarPelis, un click en
 * la tarjeta abre la vista previa en vez de mandar directo afuera.
 */
export function MovieCard({ item, domain }: { item: EcosystemMovieItem; domain: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex-shrink-0 w-[130px] md:w-[160px] rounded-lg overflow-hidden bg-[#181818] border border-white/5 hover:border-[#0be881]/40 transition-all hover:scale-[1.04] hover:z-10 text-left"
        style={{ aspectRatio: "2/3" }}
      >
        {item.posterUrl ? (
          <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs px-2 text-center">{item.title}</div>
        )}

        {item.rank && (
          <span
            className="absolute left-0 bottom-0 text-7xl font-black leading-none select-none"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: "#0a0a0a",
              WebkitTextStroke: "1.5px rgba(255,255,255,0.65)",
            }}
          >
            {item.rank}
          </span>
        )}

        {!item.rank && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        )}
      </button>

      {open && <MoviePreviewModal item={item} domain={domain} onClose={() => setOpen(false)} />}
    </>
  );
}
