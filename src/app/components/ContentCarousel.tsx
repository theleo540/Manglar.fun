import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { ContentItem } from "../types/content";
import { ContentCard } from "./ContentCard";
import { ScrollableRow } from "./ScrollableRow";

/**
 * Carousel genérico reutilizable — hoy lo usa, por ejemplo, la fila de
 * Películas (portrait) en cuanto haya datos reales. El scroll horizontal
 * vive en <ScrollableRow>, así queda igual en todas las verticales.
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
  return (
    <section id={id} className="mb-10">
      <div className="flex items-center gap-2 mb-4 px-6 md:px-12">
        <span className="text-[#0be881]">{icon}</span>
        <h2 className="text-white font-bold text-base md:text-lg tracking-tight">{title}</h2>
        <button className="ml-1 flex items-center gap-0.5 text-[#0be881] text-[10px] font-bold tracking-widest uppercase hover:opacity-70 transition-opacity">
          Ver todo <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <ScrollableRow>
        {items.map((item) => (
          <ContentCard key={item.id} item={item} variant={variant} />
        ))}
      </ScrollableRow>
    </section>
  );
}
