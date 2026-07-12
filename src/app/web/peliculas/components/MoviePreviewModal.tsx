import { createPortal } from "react-dom";
import { Play, X, Star } from "lucide-react";
import type { EcosystemMovieItem } from "../../shared/types";

/**
 * Mismo comportamiento que PreviewModal.tsx en ManglarPelis: click en
 * una tarjeta abre esto en vez de mandar directo al sitio real. El
 * hub no tiene "Mi lista"/"Like" (eso vive en la cuenta de
 * ManglarPelis), así que aquí es solo vista previa + "Ver ahora".
 *
 * "Ver ahora" manda a `${domain}/?title=${item.id}` — ManglarPelis
 * lee ese query param al montar y abre el detalle directo (ver
 * App.tsx de ManglarPelis, initialPage).
 */
export function MoviePreviewModal({ item, domain, onClose }: { item: EcosystemMovieItem; domain: string; onClose: () => void }) {
  const watchUrl = domain ? `${domain}/?title=${item.id}` : "#";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#181818]/35 backdrop-blur-md rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "cardExpand 0.2s ease-out" }}
      >
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <img
            src={item.backdropUrl || item.posterUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/10 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#181818] border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Cerrar"
          >
            <X size={16} color="white" />
          </button>

          {item.rank && (
            <span className="absolute top-3 left-3 text-[11px] font-bold px-2 py-0.5 rounded-sm bg-[#0be881] text-[#080808]">
              TOP {item.rank}
            </span>
          )}

          <h2 className="absolute bottom-4 left-5 right-5 text-white text-2xl md:text-3xl font-extrabold font-['Barlow_Condensed'] tracking-tight">
            {item.title}
          </h2>
        </div>

        <div className="px-5 md:px-7 pt-5 pb-6">
          <div className="flex items-center gap-2.5 mb-4">
            <a
              href={watchUrl}
              className="flex items-center gap-2 px-5 h-10 rounded-full bg-white hover:bg-white/90 transition-colors font-semibold text-sm text-[#080808]"
            >
              <Play size={16} fill="#080808" color="#080808" />
              Ver ahora
            </a>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs bg-white/10 text-white/80 px-2 py-0.5 rounded-sm">
              {item.mediaType === "tv" ? "Serie" : "Película"}
            </span>
            {item.rating && (
              <span className="flex items-center gap-1 text-xs text-white/80">
                <Star size={12} className="text-[#0be881] fill-[#0be881]" />
                {item.rating}
              </span>
            )}
          </div>

          <p className="text-white/40 text-xs leading-relaxed">
            Disponible en ManglarPelis. Al hacer click en "Ver ahora" te llevamos directo a este título.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}