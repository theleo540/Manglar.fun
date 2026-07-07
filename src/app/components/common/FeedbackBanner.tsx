import { useState } from "react";
import { Instagram, X } from "lucide-react";

// ✏️ Cambia esto por tu usuario de Instagram
export const INSTAGRAM_USER = "valle.mav";

interface FeedbackBannerProps {
  className?: string;
}

export function FeedbackBanner({ className = "" }: FeedbackBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className={`relative w-full bg-card/40 border-b border-border overflow-hidden ${className}`}>
      <style>{`
        @keyframes feedback-marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .feedback-marquee-track {
          animation: feedback-marquee 26s linear infinite;
        }
        .feedback-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="py-1.5 pl-3 pr-12 overflow-hidden">
        <div className="feedback-marquee-track whitespace-nowrap text-[11px] sm:text-xs text-muted-foreground">
          ¿Encontraste alguna falla o tienes alguna sugerencia? Escríbenos por Instagram, buscanos como @{INSTAGRAM_USER}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Cerrar"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}