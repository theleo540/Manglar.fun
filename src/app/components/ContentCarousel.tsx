import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ContentItem } from "../types/content";
import { ContentCard } from "./ContentCard";

/**
 * Carousel genérico reutilizable. Sin uso activo hoy (no hay datos
 * reales de sobra para llenarlo), pero listo para cuando WC2026 u otro
 * proyecto tenga una lista real (ej. próximos partidos, próximos
 * juegos de NBA) que valga la pena mostrar en fila.
 */
export function ContentCarousel({
  id, title, icon, items, variant = "landscape",
}: {
  id: string;
  title: string;
  icon: ReactNode;
  items: ContentItem[];
  variant?: "landscape" | "portrait";
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const check = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 680 : -680,
      behavior: "smooth",
    });
  };

  return (
    <section id={id} className="mb-10">
      <div className="flex items-center gap-2 mb-4 px-6 md:px-12">
        <span className="text-[#0be881]">{icon}</span>
        <h2 className="text-white font-bold text-base md:text-lg tracking-tight">{title}</h2>
        <button className="ml-1 flex items-center gap-0.5 text-[#0be881] text-[10px] font-bold tracking-widest uppercase hover:opacity-70 transition-opacity">
          Ver todo <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="relative group/row">
        {canLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-4 z-20 w-14 bg-gradient-to-r from-[#080808] to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-black/80 border border-white/15 flex items-center justify-center hover:bg-[#0be881] hover:border-[#0be881] transition-all group/btn">
              <ChevronLeft className="w-4 h-4 text-white group-hover/btn:text-black transition-colors" />
            </div>
          </button>
        )}
        {canRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-4 z-20 w-20 bg-gradient-to-l from-[#080808] to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-black/80 border border-white/15 flex items-center justify-center hover:bg-[#0be881] hover:border-[#0be881] transition-all group/btn">
              <ChevronRight className="w-4 h-4 text-white group-hover/btn:text-black transition-colors" />
            </div>
          </button>
        )}
        <div
          ref={scrollRef}
          onScroll={check}
          className="flex gap-3 overflow-x-auto px-6 md:px-12 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <ContentCard key={item.id} item={item} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  );
}
