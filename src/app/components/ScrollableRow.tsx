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
          className="hidden [@media(hover:hover)_and_(pointer:fine)]:flex absolute left-0 top-0 bottom-0 z-20 w-10 md:w-14 items-center justify-center bg-gradient-to-r from-[#080808] to-transparent opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 transition-opacity hover:from-[#080808]/80"
        >
          <ChevronLeft size={30} color="white" />
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Desplazar a la derecha"
          className="hidden [@media(hover:hover)_and_(pointer:fine)]:flex absolute right-0 top-0 bottom-0 z-20 w-10 md:w-14 items-center justify-center bg-gradient-to-l from-[#080808] to-transparent opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 transition-opacity hover:from-[#080808]/80"
        >
          <ChevronRight size={30} color="white" />
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