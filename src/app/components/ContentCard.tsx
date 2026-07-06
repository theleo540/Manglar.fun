import { useState } from "react";
import { motion } from "motion/react";
import { Play, Plus, Star } from "lucide-react";
import type { ContentItem } from "../types/content";
import { TagBadge } from "./TagBadge";

/**
 * Card genérica reutilizable (usada antes para el fake Netflix-clone,
 * hoy sin uso activo). Se deja lista para cuando un proyecto real del
 * ecosistema (ej. próximos partidos de fútbol, o NBA) tenga una lista
 * de ContentItem[] real para mostrar en un ContentCarousel.
 */
export function ContentCard({ item, variant }: { item: ContentItem; variant: "landscape" | "portrait" }) {
  const [hovered, setHovered] = useState(false);
  const isPortrait = variant === "portrait";
  const cardW = isPortrait ? "w-[152px] md:w-[172px]" : "w-[300px] md:w-[340px]";
  const cardH = isPortrait ? "h-[228px] md:h-[258px]" : "h-[169px] md:h-[191px]";

  return (
    <motion.div
      className={`flex-shrink-0 ${cardW} cursor-pointer`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={hovered ? { scale: 1.12, zIndex: 30 } : { scale: 1, zIndex: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{ position: "relative" }}
    >
      <motion.div
        className={`relative ${cardH} overflow-hidden rounded-lg bg-[#141414]`}
        animate={
          hovered
            ? {
                boxShadow:
                  "0 0 0 1.5px rgba(11,232,129,0.5), 0 12px 48px rgba(11,232,129,0.22), 0 24px 64px rgba(0,0,0,0.7)",
              }
            : {
                boxShadow:
                  "0 0 0 0px rgba(11,232,129,0), 0 4px 12px rgba(0,0,0,0.4)",
              }
        }
        transition={{ duration: 0.25 }}
      >
        <motion.img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          animate={hovered ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        <motion.div
          className="absolute inset-0"
          animate={
            hovered
              ? { background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)" }
              : { background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)" }
          }
          transition={{ duration: 0.3 }}
        />

        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(11,232,129,0.12) 0%, transparent 70%)",
            }}
          />
        )}

        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          {item.tag && <TagBadge type={item.tagType} label={item.tag} />}
        </div>
        {item.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5">
            <Star className="w-2.5 h-2.5 fill-[#0be881] text-[#0be881]" />
            <span className="text-white text-[10px] font-bold">{item.rating}</span>
          </div>
        )}

        {item.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15">
            <div className="h-full bg-[#0be881]" style={{ width: `${item.progress}%` }} />
          </div>
        )}

        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-3"
          initial={false}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <p className="text-white font-bold text-xs leading-tight mb-0.5 drop-shadow-sm">{item.title}</p>
          <p className="text-white/60 text-[10px] leading-tight mb-2.5">{item.subtitle}</p>
          <div className="flex gap-1.5">
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-[#0be881] transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-black text-black" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:border-[#0be881] hover:bg-[#0be881]/15 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {isPortrait && (
        <motion.div
          className="mt-2"
          animate={hovered ? { opacity: 1 } : { opacity: 0.7 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-white text-xs font-semibold truncate">{item.title}</p>
          <p className="text-white/35 text-[10px] truncate">{item.subtitle}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
