import { useEffect, useState } from "react";
import { Bell, LogOut, Search, Settings, User, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Fútbol", href: "#ecosistema" },
  // Cuando exista un proyecto nuevo (NBA, Games, TV, News) se agrega
  // aquí su link real. No agregar nada que no tenga un proyecto detrás.
];

export function Navbar({ scrolled }: { scrolled: boolean }) {
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
