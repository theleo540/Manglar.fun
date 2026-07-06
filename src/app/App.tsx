import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search, Bell, ChevronRight, ChevronLeft, Play, Plus, Info,
  Star, X, User, Settings, LogOut, Tv, Gamepad2, Newspaper,
  Trophy, TrendingUp, Zap, Volume2, VolumeX, ExternalLink,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContentItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  tag?: string;
  tagType?: "live" | "new" | "trending" | "hot";
  rating?: string;
  progress?: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Fútbol", href: "#ecosistema" },
  // Cuando exista un proyecto nuevo (NBA, Games, TV, News) se agrega aquí
  // su link real. No agregar nada que no tenga un proyecto detrás.
];

// ─── Ecosistema Manglar: registry de proyectos reales ─────────────────────────
// Cada proyecto real expone GET /api/widget (ver server.js de WC2026Streams).
// Para agregar un proyecto nuevo (ej. NBA) solo se agrega una línea aquí,
// apuntando a su propio /api/widget — nada más se toca en este archivo.
const ECOSYSTEM_PROJECTS = [
  { slug: "wc2026streams", widgetUrl: "https://wc2026streams.manglar.fun/api/widget" },
  // { slug: "nba",   widgetUrl: "https://nba.manglar.fun/api/widget" },
  // { slug: "games", widgetUrl: "https://games.manglar.fun/api/widget" },
  // { slug: "tv",    widgetUrl: "https://tv.manglar.fun/api/widget" },
  // { slug: "news",  widgetUrl: "https://news.manglar.fun/api/widget" },
];

interface WidgetResponse {
  project: string;
  title: string;
  description: string;
  domain: string;
  status: "live" | "scheduled" | "idle";
  card: {
    home: string;
    away: string;
    homeCrest?: string;
    awayCrest?: string;
    utcDate: string;
  } | null;
}

// NOTA: aquí antes había arrays fake de sports/games/tv/news (LaLiga, NBA,
// Valorant, Stranger Things, etc.) que no correspondían a ningún proyecto
// real. Se eliminaron. El componente ContentCarousel de abajo se mantiene
// intacto — cuando un proyecto nuevo del ecosistema exista de verdad
// (ej. NBA), se le llama igual que a Fútbol: agregando su entrada en
// ECOSYSTEM_PROJECTS y, si aplica, un <ContentCarousel> con datos reales
// de su propio /api/matches (o equivalente), nunca con datos inventados.

// ─── Tag Badge ────────────────────────────────────────────────────────────────

function TagBadge({ type, label }: { type?: string; label: string }) {
  const map: Record<string, string> = {
    live: "bg-red-600 text-white",
    new: "bg-[#0be881] text-black",
    trending: "bg-orange-500 text-white",
    hot: "bg-pink-600 text-white",
  };
  const cls = map[type ?? ""] ?? "bg-white/20 text-white";
  const isLive = type === "live";
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-sm ${cls} ${isLive ? "animate-pulse" : ""}`}>
      {isLive && <span className="w-1 h-1 rounded-full bg-white" />}
      {label}
    </span>
  );
}

// ─── Content Card ─────────────────────────────────────────────────────────────

function ContentCard({ item, variant }: { item: ContentItem; variant: "landscape" | "portrait" }) {
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

        {/* dark gradient — deeper on hover */}
        <motion.div
          className="absolute inset-0"
          animate={
            hovered
              ? { background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)" }
              : { background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)" }
          }
          transition={{ duration: 0.3 }}
        />

        {/* green shimmer on hover */}
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

        {/* top badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          {item.tag && <TagBadge type={item.tagType} label={item.tag} />}
        </div>
        {item.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5">
            <Star className="w-2.5 h-2.5 fill-[#0be881] text-[#0be881]" />
            <span className="text-white text-[10px] font-bold">{item.rating}</span>
          </div>
        )}

        {/* progress bar */}
        {item.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15">
            <div className="h-full bg-[#0be881]" style={{ width: `${item.progress}%` }} />
          </div>
        )}

        {/* hover info + actions */}
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

// ─── Content Carousel ─────────────────────────────────────────────────────────

function ContentCarousel({
  id, title, icon, items, variant = "landscape",
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
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

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [muted, setMuted] = useState(true);
  const [widget, setWidget] = useState<WidgetResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const wc2026 = ECOSYSTEM_PROJECTS.find((p) => p.slug === "wc2026streams");
    if (!wc2026) return;
    fetch(wc2026.widgetUrl)
      .then((r) => r.json())
      .then((data: WidgetResponse) => setWidget(data))
      .catch(() => setWidget(null))
      .finally(() => setLoaded(true));
  }, []);

  const isLive = widget?.status === "live";
  const match = widget?.card;
  const domain = widget?.domain || "https://wc2026streams.manglar.fun";

  const title = match ? `${match.home} vs ${match.away}` : "WC2026 Streams";
  const meta = match
    ? new Date(match.utcDate).toLocaleString("es-MX", {
        weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
      })
    : "Fútbol en vivo · Mundial 2026";
  const description = match
    ? "Sigue el partido en vivo con chat en tiempo real, contador de espectadores y transmisión en HD."
    : loaded
      ? "Aún no hay partido en vivo o programado. Vuelve pronto para ver la transmisión."
      : "Cargando información en vivo...";

  return (
    <section className="relative w-full h-[88vh] min-h-[520px] overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-black to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      {/* ambient glow */}
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-[#0be881]/4 rounded-full blur-3xl pointer-events-none" />

      {match?.homeCrest && match?.awayCrest && (
        <div className="absolute top-1/2 right-8 md:right-24 -translate-y-1/2 flex items-center gap-6 opacity-90">
          <img src={match.homeCrest} alt={match.home} className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl" />
          <span className="text-white/30 text-2xl font-black">VS</span>
          <img src={match.awayCrest} alt={match.away} className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl" />
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-end pb-28 px-6 md:px-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-[#0be881] text-[11px] font-black tracking-[0.22em] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              WC2026 STREAMS
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

          <h1
            className="text-white text-5xl md:text-7xl font-black leading-none tracking-tight mb-3 uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {title}
          </h1>

          <p
            className="text-white/50 text-xs font-medium tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {meta}
          </p>

          <p className="text-white/65 text-sm md:text-base leading-relaxed mb-8 max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {description}
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
        </motion.div>
      </div>

      {/* mute toggle — se queda como control visual del hero */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-32 right-8 md:right-12 w-10 h-10 rounded-full border border-white/25 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:border-[#0be881] hover:text-[#0be881] transition-all"
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </section>
  );
}

// ─── Ecosystem Strip ──────────────────────────────────────────────────────────

const ECOSYSTEM_APPS = [
  { label: "football.manglar.fun", icon: <Trophy className="w-4 h-4" />, desc: "Fútbol en vivo", accent: "from-emerald-950/60" },
  { label: "nba.manglar.fun", icon: <Star className="w-4 h-4" />, desc: "Basketball 24/7", accent: "from-orange-950/60" },
  { label: "games.manglar.fun", icon: <Gamepad2 className="w-4 h-4" />, desc: "eSports & Gaming", accent: "from-purple-950/60" },
  { label: "tv.manglar.fun", icon: <Tv className="w-4 h-4" />, desc: "Series & Películas", accent: "from-sky-950/60" },
  { label: "news.manglar.fun", icon: <Newspaper className="w-4 h-4" />, desc: "Noticias Globales", accent: "from-rose-950/60" },
];

function EcosystemStrip() {
  const [projects, setProjects] = useState<WidgetResponse[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      ECOSYSTEM_PROJECTS.map((p) =>
        fetch(p.widgetUrl)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setProjects(results.filter((r): r is WidgetResponse => r !== null));
      setChecked(true);
    });
    return () => { cancelled = true; };
  }, []);

  // Mientras no haya ni un solo proyecto real respondiendo, no se pinta nada
  // (nada de tarjetas falsas de "próximamente").
  if (checked && projects.length === 0) return null;

  return (
    <div id="ecosistema" className="px-6 md:px-12 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-3.5 h-3.5 text-[#0be881]" />
        <span
          className="text-white/35 text-[10px] font-medium tracking-[0.25em] uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Ecosistema Manglar
        </span>
      </div>
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {projects.map((app) => (
          <a
            key={app.project}
            href={app.domain}
            className="flex-shrink-0 flex items-center gap-3 bg-white/4 hover:bg-white/8 border border-white/8 hover:border-[#0be881]/35 rounded-xl px-4 py-3 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0be881]/10 group-hover:bg-[#0be881]/18 flex items-center justify-center text-[#0be881] transition-colors flex-shrink-0 relative">
              <Trophy className="w-4 h-4" />
              {app.status === "live" && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            <div className="text-left min-w-0">
              <p className="text-white text-xs font-semibold truncate">{app.title}</p>
              <p className="text-white/35 text-[10px]">
                {app.status === "live" ? "En vivo ahora" : app.description}
              </p>
            </div>
            <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-[#0be881]/60 ml-1 flex-shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ scrolled }: { scrolled: boolean }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Inicio");

  useEffect(() => {
    const close = () => setProfileOpen(false);
    if (profileOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [profileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#080808]/97 backdrop-blur-md border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 h-16">
        {/* Logo + links */}
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-1.5 h-5 bg-[#0be881] rounded-full" />
            <span
              className="text-white font-black text-xl tracking-tight uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              MANG<span className="text-[#0be881]">LAR</span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveNav(link.label)}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  activeNav === link.label ? "text-white" : "text-white/55"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-black/80 border border-white/15 rounded-full px-3 py-1.5">
              <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
              <input
                autoFocus
                placeholder="Buscar contenido..."
                className="bg-transparent text-white text-sm outline-none placeholder-white/35 w-36 md:w-44"
              />
              <button onClick={() => setSearchOpen(false)}>
                <X className="w-4 h-4 text-white/50 hover:text-white transition-colors" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <button className="relative text-white/60 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#0be881] rounded-full" />
          </button>

          <div
            className="relative"
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen(!profileOpen);
            }}
          >
            <button className="w-8 h-8 rounded-full bg-[#0be881] flex items-center justify-center text-black font-black text-xs hover:ring-2 hover:ring-[#0be881]/40 transition-all select-none">
              MG
            </button>
            {profileOpen && (
              <div
                className="absolute right-0 top-11 w-48 bg-[#111111]/98 border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 border-b border-white/8">
                  <p className="text-white text-sm font-semibold">Usuario Manglar</p>
                  <p className="text-white/40 text-xs">Premium · Activo</p>
                </div>
                {[
                  { icon: <User className="w-3.5 h-3.5" />, label: "Mi Perfil" },
                  { icon: <Settings className="w-3.5 h-3.5" />, label: "Configuración" },
                  { icon: <LogOut className="w-3.5 h-3.5" />, label: "Cerrar Sesión" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16 px-6 md:px-12 pt-10 pb-8">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 md:items-start">
        <div className="flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-5 bg-[#0be881] rounded-full" />
            <span
              className="text-white font-black text-lg uppercase tracking-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              MANG<span className="text-[#0be881]">LAR</span>
            </span>
          </div>
          <p className="text-white/28 text-xs max-w-[200px] leading-relaxed">
            Plataforma premium de entretenimiento y deportes en vivo.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs text-white/35">
          {[
            { title: "Productos", links: ["football.manglar.fun", "nba.manglar.fun", "games.manglar.fun", "tv.manglar.fun", "news.manglar.fun"] },
            { title: "Plataforma", links: ["admin.manglar.fun", "API Docs", "Status", "Changelog"] },
            { title: "Legal", links: ["Privacidad", "Términos de Uso", "Cookies", "DMCA"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-white/55 font-semibold mb-3 uppercase tracking-widest text-[10px]">{col.title}</p>
              {col.links.map((l) => (
                <p key={l} className="mb-2 hover:text-white/70 cursor-pointer transition-colors">{l}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-2 text-white/18 text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <span>© 2025 Manglar Ecosystem. All rights reserved.</span>
        <span>manglar.fun · football · nba · games · tv · news · admin</span>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#080808] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar scrolled={scrolled} />
      <Hero />

      <div className="pt-8">
        <EcosystemStrip />

        {/*
          Cuando exista un proyecto nuevo con datos reales (ej. NBA), se
          agrega aquí un ContentCarousel alimentado por su propia API,
          igual que se hará más adelante con partidos reales de fútbol:

          <ContentCarousel
            id="futbol"
            title="Próximos Partidos"
            icon={<Trophy className="w-4 h-4" />}
            items={proximosPartidosReales}
            variant="landscape"
          />
        */}
      </div>

      <Footer />
    </div>
  );
}