/**
 * Footer con links reales del ecosistema. Cada vertical real se
 * agrega a mano aquí (mismo criterio que web/registry.ts) — nunca
 * subdominios inventados.
 */
export function Footer() {
  const productLinks = [
    { label: "Fútbol · WC2026 Streams", href: `https://wc2026streams.manglar.fun` },
    // { label: "NBA", href: "https://nba.manglar.fun" },
    // { label: "Películas", href: "https://peliculas.manglar.fun" },
  ];

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
          <div>
            <p className="text-white/55 font-semibold mb-3 uppercase tracking-widest text-[10px]">Productos</p>
            {productLinks.map((l) => (
              <a key={l.href} href={l.href} className="block mb-2 hover:text-white/70 cursor-pointer transition-colors">
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <p className="text-white/55 font-semibold mb-3 uppercase tracking-widest text-[10px]">Legal</p>
            {["Privacidad", "Términos de Uso", "Cookies", "DMCA"].map((l) => (
              <p key={l} className="mb-2 hover:text-white/70 cursor-pointer transition-colors">{l}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-2 text-white/18 text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <span>© 2026 Manglar Ecosystem. All rights reserved.</span>
        <span>manglar.fun</span>
      </div>
    </footer>
  );
}
