import { Film, Heart, Bookmark, Link2, MousePointerClick } from "lucide-react";
import { useEcosystemActivity } from "@/hooks/useEcosystemActivity";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

const MANGLARPELIS_URL = "https://manglarpelis.manglar.fun";
const GOCUT_URL = "https://gocut.manglar.fun";

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
      <span className="text-emerald-400">{icon}</span>
      <span className="text-sm font-semibold text-white font-mono">{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}

function Poster({ title, posterUrl, sub, href }: { title: string; posterUrl: string; sub?: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[120px] group"
      title={title}
    >
      <div className="w-[120px] h-[168px] rounded-lg overflow-hidden bg-[#0d1117] border border-white/[0.06] group-hover:border-emerald-400/40 transition-colors">
        {posterUrl ? (
          <ImageWithFallback src={posterUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <Film className="w-6 h-6" />
          </div>
        )}
      </div>
      <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
        {title}
      </p>
      {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
    </a>
  );
}

function SectionShell({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="text-sm text-slate-500">{text}</p>;
}

/**
 * Recopilación real de actividad del usuario en los productos del
 * ecosistema (ManglarPelis, GoCut), leída directo de Supabase. Se
 * muestra en el perfil de usuarios normales — hasta ahora la única
 * data que veían ahí era la de `profiles`, nada de lo que en verdad
 * generan usando el resto del ecosistema.
 */
export function EcosystemActivitySection({ ownerEmail }: { ownerEmail: string }) {
  const { activity, loading } = useEcosystemActivity(ownerEmail);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 rounded-2xl border border-white/[0.08] bg-[#161B22] animate-pulse" />
        <div className="h-40 rounded-2xl border border-white/[0.08] bg-[#161B22] animate-pulse" />
      </div>
    );
  }

  if (!activity) return null;

  const { manglarpelis, gocut } = activity;
  const hasAnyActivity =
    manglarpelis.continueWatching.length > 0 ||
    manglarpelis.likes.length > 0 ||
    manglarpelis.listCount > 0 ||
    manglarpelis.completedCount > 0 ||
    gocut.links.length > 0;

  if (!hasAnyActivity) {
    return (
      <SectionShell title="Tu actividad en el ecosistema">
        <EmptyRow text="Todavía no tenés actividad en ManglarPelis ni en GoCut. Cuando veas algo, le des like, o acortes un link, va a aparecer acá." />
      </SectionShell>
    );
  }

  return (
    <div className="space-y-6">
      <SectionShell
        title="ManglarPelis"
        action={
          <a href={MANGLARPELIS_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:underline">
            Ir al sitio →
          </a>
        }
      >
        <div className="flex flex-wrap gap-2 mb-5">
          <MiniStat icon={<Heart className="w-3.5 h-3.5" />} label="likes" value={manglarpelis.likesCount} />
          <MiniStat icon={<Bookmark className="w-3.5 h-3.5" />} label="en tu lista" value={manglarpelis.listCount} />
          <MiniStat icon={<Film className="w-3.5 h-3.5" />} label="completados" value={manglarpelis.completedCount} />
        </div>

        {manglarpelis.continueWatching.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium text-slate-400 mb-2.5">Continuar viendo</p>
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {manglarpelis.continueWatching.map((item) => (
                <Poster
                  key={`${item.itemId}-${item.product}`}
                  title={item.title}
                  posterUrl={item.posterUrl}
                  sub={item.totalEpisodes ? `Ep. ${item.episodesWatched}/${item.totalEpisodes}` : undefined}
                  href={MANGLARPELIS_URL}
                />
              ))}
            </div>
          </div>
        )}

        {manglarpelis.likes.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2.5">Tus likes</p>
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {manglarpelis.likes.map((item) => (
                <Poster key={`${item.itemId}-${item.product}`} title={item.title} posterUrl={item.posterUrl} href={MANGLARPELIS_URL} />
              ))}
            </div>
          </div>
        )}
      </SectionShell>

      <SectionShell
        title="GoCut"
        action={
          <a href={GOCUT_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:underline">
            Ir al sitio →
          </a>
        }
      >
        <div className="flex flex-wrap gap-2 mb-5">
          <MiniStat icon={<Link2 className="w-3.5 h-3.5" />} label="links creados" value={gocut.linksCount} />
          <MiniStat icon={<MousePointerClick className="w-3.5 h-3.5" />} label="clicks totales" value={gocut.totalClicks} />
        </div>

        {gocut.links.length > 0 ? (
          <div className="space-y-2">
            {gocut.links.map((link) => (
              <a
                key={link.slug}
                href={`${GOCUT_URL}/${link.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-emerald-400/40 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-sm text-emerald-400 font-mono truncate">gocut.link/{link.slug}</p>
                  <p className="text-xs text-slate-500 truncate">{link.longUrl}</p>
                </div>
                <span className="flex-shrink-0 text-xs text-slate-400 font-mono">{link.clicks} clicks</span>
              </a>
            ))}
          </div>
        ) : (
          <EmptyRow text="Todavía no creaste ningún link." />
        )}
      </SectionShell>
    </div>
  );
}
