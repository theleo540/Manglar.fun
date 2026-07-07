import { useEffect, useRef, useState } from "react";
import {
  Bell, Github, LayoutDashboard, LogOut, Search, Settings, Shield, User, X,
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/hooks/useAdmin";
import { useSiteSearch } from "@/hooks/useSiteSearch";
import { ROUTES, type AppRoute } from "@/config/routes";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants/roles";
import type { AdminRole } from "@/types/admin";
import { AuthModal, GoogleIcon, type AuthMode } from "./AuthModal";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Fútbol", href: "#ecosistema" },
  // Cuando exista un proyecto nuevo (NBA, Games, TV, News) se agrega
  // aquí su link real. No agregar nada que no tenga un proyecto detrás.
];

/**
 * Navbar con login único (multi-login): el mismo botón sirve para
 * usuarios normales y para admins. Cualquiera puede iniciar sesión con
 * GitHub; si el email está en AUTHORIZED_ADMINS obtiene modo admin
 * (accesos a Dashboard/Perfil), si no, queda en modo usuario normal
 * (solo puede cerrar sesión por ahora — no hay perfil de usuario común
 * todavía, eso es una función aparte a diseñar).
 */
export function Navbar({ scrolled, navigate }: { scrolled: boolean; navigate: (route: AppRoute) => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Inicio");
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: AuthMode }>({ open: false, mode: "login" });
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const { user, isAdmin, isSuperAdmin, isLoggedIn, login, logout, loading } = useAdmin();
  const { results, hasQuery } = useSiteSearch(query);

  useEffect(() => {
    const close = () => setProfileOpen(false);
    if (profileOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [profileOpen]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery("");
      }
    }
    if (searchOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function goToResult(href: string) {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else if (href !== "#") {
      window.open(href, "_blank", "noopener,noreferrer");
    }
    closeSearch();
  }

  const roleForBadge: AdminRole | null = isSuperAdmin ? "super-admin" : isAdmin ? "admin" : null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#080808]/97 backdrop-blur-md border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 h-16">
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

        <div className="flex items-center gap-4">
          {/* Buscador real: filtra sobre los widgets/partidos que sí existen hoy */}
          <div ref={searchBoxRef} className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-black/80 border border-white/15 rounded-full px-3 py-1.5">
                <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar contenido..."
                  className="bg-transparent text-white text-sm outline-none placeholder-white/35 w-36 md:w-56"
                />
                <button onClick={closeSearch}>
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

            {searchOpen && hasQuery && (
              <div className="absolute right-0 top-11 w-72 max-h-80 overflow-y-auto bg-[#111111]/98 border border-white/10 rounded-xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
                {results.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-white/40">Sin resultados para "{query}"</p>
                ) : (
                  results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => goToResult(r.href)}
                      className="w-full text-left px-4 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <p className="text-white text-sm font-medium truncate">{r.label}</p>
                      <p className="text-white/40 text-xs truncate">{r.meta}</p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <button className="relative text-white/60 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#0be881] rounded-full" />
          </button>

          {/* Login único: usuarios normales y admins comparten este botón */}
          <div
            className="relative"
            onClick={(e) => {
              e.stopPropagation();
              if (!loading) setProfileOpen(!profileOpen);
            }}
          >
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all select-none ${
                isLoggedIn
                  ? "bg-[#0be881] text-black hover:ring-2 hover:ring-[#0be881]/40"
                  : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
              }`}
              title={isLoggedIn ? user?.name : "Iniciar sesión"}
            >
              {isLoggedIn && user ? (
                user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-11 w-56 bg-[#111111]/98 border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
                onClick={(e) => e.stopPropagation()}
              >
                {isLoggedIn && user ? (
                  <>
                    <div className="p-3 border-b border-white/8">
                      <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                      {roleForBadge ? (
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ROLE_COLORS[roleForBadge].text} ${ROLE_COLORS[roleForBadge].bg} ${ROLE_COLORS[roleForBadge].border}`}
                        >
                          {ROLE_LABELS[roleForBadge]}
                        </span>
                      ) : (
                        <p className="text-white/40 text-xs">Cuenta · Modo usuario</p>
                      )}
                    </div>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => { setProfileOpen(false); navigate(ROUTES.PROFILE); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors"
                        >
                          <User className="w-3.5 h-3.5" /> Mi Perfil
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); navigate(ROUTES.DASHBOARD); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                        </button>
                      </>
                    )}

                    {!isAdmin && (
                      <button
                        disabled
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-white/30 text-sm cursor-not-allowed"
                        title="Perfil de usuario — próximamente"
                      >
                        <Settings className="w-3.5 h-3.5" /> Configuración (próximamente)
                      </button>
                    )}

                    <button
                      onClick={() => { setProfileOpen(false); logout(); navigate(ROUTES.HOME); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 text-sm transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <div className="p-3">
                    <p className="text-xs text-slate-400 mb-2.5 px-1 flex items-center gap-1.5">
                      <Shield className="w-3 h-3" /> Inicia sesión para continuar
                    </p>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => { setProfileOpen(false); login(); }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-sm text-white transition-colors"
                      >
                        <Github className="w-4 h-4" /> Entrar con GitHub
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          toast.info("Iniciar con Google — próximamente");
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-sm text-white transition-colors"
                      >
                        <GoogleIcon className="w-4 h-4" /> Entrar con Google
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setAuthModal({ open: true, mode: "register" });
                      }}
                      className="w-full mt-3 pt-3 border-t border-white/8 text-center text-xs text-[#0be881] hover:text-white font-medium transition-colors"
                    >
                      ¿No tienes cuenta? Regístrate
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        open={authModal.open}
        mode={authModal.mode}
        onModeChange={(mode) => setAuthModal({ open: true, mode })}
        onClose={() => setAuthModal({ open: false, mode: authModal.mode })}
        onGithubLogin={() => {
          login();
          setAuthModal({ open: false, mode: authModal.mode });
        }}
      />
    </nav>
  );
}
