import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Fila con scroll horizontal + flechas para escritorio.
 *
 * En móvil el swipe nativo ya funciona sin botones. En PC (mouse, sin
 * touch/trackpad de swipe) no hay forma de mover el scroll si no hay
 * un botón — por eso este wrapper siempre calcula si se puede mover a
 * la izquierda/derecha (incluso al montar, no solo al hacer scroll) y
 * pinta las flechas cuando corresponde.
 *
 * Usarlo en cualquier fila nueva (NBA, Películas, lo que sea) en vez
 * de repetir el <div overflow-x-auto> a mano, así todas quedan iguales
 * y con el mismo fix.
 */
export function ScrollableRow({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const check = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    check();
    const el = scrollRef.current;
    if (!el) return;
    const onResize = () => check();
    window.addEventListener("resize", onResize);
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [children]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 680 : -680,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/row">
      {canLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Desplazar a la izquierda"
          className="absolute left-0 top-0 bottom-4 z-20 w-14 bg-gradient-to-r from-[#080808] to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-black/80 border border-white/15 flex items-center justify-center hover:bg-[#0be881] hover:border-[#0be881] transition-all group/btn">
            <ChevronLeft className="w-4 h-4 text-white group-hover/btn:text-black transition-colors" />
          </div>
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Desplazar a la derecha"
          className="absolute right-0 top-0 bottom-4 z-20 w-20 bg-gradient-to-l from-[#080808] to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-black/80 border border-white/15 flex items-center justify-center hover:bg-[#0be881] hover:border-[#0be881] transition-all group/btn">
            <ChevronRight className="w-4 h-4 text-white group-hover/btn:text-black transition-colors" />
          </div>
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={check}
        className="flex gap-3 overflow-x-auto px-6 md:px-12 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  );
}
