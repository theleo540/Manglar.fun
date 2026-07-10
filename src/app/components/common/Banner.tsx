// components/common/Banner.tsx
import { motion } from "motion/react";
import { type LucideIcon } from "lucide-react";
import React from "react";
import { getExternalLinkTarget } from "../../utils/linkTarget";

type BannerVariant =
  | "green" | "amber" | "blue" | "red" | "purple"
  | "orange" | "pink" | "cyan" | "lime" | "emerald"
  | "teal" | "sky" | "indigo" | "violet" | "fuchsia"
  | "rose" | "yellow" | "stone" | "neutral" | "zinc"
  | "slate" | "gray" | "brown" | "gold" | "silver"
  | "bronze" | "crimson" | "navy" | "mint" | "coral"
  | "lavender" | "peach" | "aqua" | "charcoal" | "ruby";

const GRADIENTS: Record<BannerVariant, string> = {
  green:    "linear-gradient(to right, #0d1117 0%, #0f6e3f 100%)",
  amber:    "linear-gradient(to right, #0d0a00 0%, #92400e 100%)",
  blue:     "linear-gradient(to right, #0d1117 0%, #1d4ed8 100%)",
  red:      "linear-gradient(to right, #0d1117 0%, #b91c1c 100%)",
  purple:   "linear-gradient(to right, #0d1117 0%, #7e22ce 100%)",

  orange:   "linear-gradient(to right, #0d1117 0%, #ea580c 100%)",
  pink:     "linear-gradient(to right, #0d1117 0%, #db2777 100%)",
  cyan:     "linear-gradient(to right, #0d1117 0%, #0891b2 100%)",
  lime:     "linear-gradient(to right, #0d1117 0%, #65a30d 100%)",
  emerald:  "linear-gradient(to right, #0d1117 0%, #059669 100%)",

  teal:     "linear-gradient(to right, #0d1117 0%, #0f766e 100%)",
  sky:      "linear-gradient(to right, #0d1117 0%, #0284c7 100%)",
  indigo:   "linear-gradient(to right, #0d1117 0%, #4338ca 100%)",
  violet:   "linear-gradient(to right, #0d1117 0%, #6d28d9 100%)",
  fuchsia:  "linear-gradient(to right, #0d1117 0%, #c026d3 100%)",

  rose:     "linear-gradient(to right, #0d1117 0%, #e11d48 100%)",
  yellow:   "linear-gradient(to right, #0d1117 0%, #ca8a04 100%)",
  stone:    "linear-gradient(to right, #0d1117 0%, #57534e 100%)",
  neutral:  "linear-gradient(to right, #0d1117 0%, #525252 100%)",
  zinc:     "linear-gradient(to right, #0d1117 0%, #52525b 100%)",

  slate:    "linear-gradient(to right, #0d1117 0%, #475569 100%)",
  gray:     "linear-gradient(to right, #0d1117 0%, #4b5563 100%)",
  brown:    "linear-gradient(to right, #0d1117 0%, #78350f 100%)",
  gold:     "linear-gradient(to right, #0d1117 0%, #d4af37 100%)",
  silver:   "linear-gradient(to right, #0d1117 0%, #94a3b8 100%)",

  bronze:   "linear-gradient(to right, #0d1117 0%, #b45309 100%)",
  crimson:  "linear-gradient(to right, #0d1117 0%, #991b1b 100%)",
  navy:     "linear-gradient(to right, #0d1117 0%, #1e3a8a 100%)",
  mint:     "linear-gradient(to right, #0d1117 0%, #10b981 100%)",
  coral:    "linear-gradient(to right, #0d1117 0%, #f97316 100%)",

  lavender: "linear-gradient(to right, #0d1117 0%, #a78bfa 100%)",
  peach:    "linear-gradient(to right, #0d1117 0%, #fb923c 100%)",
  aqua:     "linear-gradient(to right, #0d1117 0%, #06b6d4 100%)",
  charcoal: "linear-gradient(to right, #0d1117 0%, #374151 100%)",
  ruby:     "linear-gradient(to right, #0d1117 0%, #be123c 100%)",
};

const CTA_COLORS: Record<BannerVariant, string> = {
  green: "text-black",
  amber: "text-amber-800",
  blue: "text-blue-900",
  red: "text-red-900",
  purple: "text-purple-900",

  orange: "text-orange-900",
  pink: "text-pink-900",
  cyan: "text-cyan-900",
  lime: "text-lime-900",
  emerald: "text-emerald-900",

  teal: "text-teal-900",
  sky: "text-sky-900",
  indigo: "text-indigo-900",
  violet: "text-violet-900",
  fuchsia: "text-fuchsia-900",

  rose: "text-rose-900",
  yellow: "text-yellow-900",
  stone: "text-stone-900",
  neutral: "text-neutral-900",
  zinc: "text-zinc-900",

  slate: "text-slate-900",
  gray: "text-gray-900",
  brown: "text-amber-950",
  gold: "text-yellow-950",
  silver: "text-slate-800",

  bronze: "text-orange-950",
  crimson: "text-red-950",
  navy: "text-blue-950",
  mint: "text-emerald-950",
  coral: "text-orange-800",

  lavender: "text-violet-800",
  peach: "text-orange-700",
  aqua: "text-cyan-800",
  charcoal: "text-slate-950",
  ruby: "text-rose-950",
};

interface BannerProps {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  customIcon?: React.ReactNode;
  ctaLabel?: string;
  ctaIcon?: LucideIcon;
  customCtaIcon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: BannerVariant;
}

export function Banner({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  subtitle,
  icon: Icon,
  customIcon,
  ctaLabel,
  ctaIcon: CtaIcon,
  customCtaIcon,
  href,
  onClick,
  variant = "green",
}: BannerProps) {
  const inner = (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative w-full rounded-2xl overflow-hidden border border-border cursor-pointer"
      style={{ background: GRADIENTS[variant] }}
    >
      {/* Patrón decorativo */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, white 0%, transparent 35%), radial-gradient(circle at 85% 70%, white 0%, transparent 30%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center gap-4 md:gap-6 px-5 md:px-8 py-6 md:py-8">
        {/* Ícono principal */}
        <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-black/20 backdrop-blur-sm flex items-center justify-center">
          {customIcon ?? (Icon && <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />)}
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <div className="flex items-center gap-2 mb-1">
              {EyebrowIcon && <EyebrowIcon className="w-4 h-4 text-white/90 shrink-0" />}
              <span className="text-xs font-bold uppercase tracking-wide text-white/90">
                {eyebrow}
              </span>
            </div>
          )}
          <h3 className="text-lg md:text-2xl font-bold text-white leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm md:text-base text-white/80 mt-1">{subtitle}</p>
          )}
        </div>

        {/* CTA desktop */}
        {ctaLabel && (
          <div className={`shrink-0 hidden sm:flex items-center gap-2 bg-white font-bold px-4 md:px-5 py-2.5 md:py-3 rounded-full text-sm md:text-base shadow-lg ${CTA_COLORS[variant]}`}>
            {customCtaIcon ?? (CtaIcon && <CtaIcon className="w-4 h-4 md:w-5 md:h-5" />)}
            {ctaLabel}
          </div>
        )}
      </div>

      {/* CTA móvil */}
      {ctaLabel && (
        <div className="relative z-10 sm:hidden border-t border-white/20 px-5 py-3 flex items-center justify-center gap-2 bg-black/15 text-white font-bold text-sm">
          {customCtaIcon ?? (CtaIcon && <CtaIcon className="w-4 h-4" />)}
          {ctaLabel}
        </div>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <div className="px-6 max-w-7xl mx-auto">
        <a href={href} target={getExternalLinkTarget()} rel="noopener noreferrer">
          {inner}
        </a>
      </div>
    );
  }

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <div onClick={onClick}>{inner}</div>
    </div>
  );
}