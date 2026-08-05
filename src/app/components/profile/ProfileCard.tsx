import { Mail, MapPin, Globe, Calendar, Pencil } from "lucide-react";
import type { Profile } from "@/types/profile";
import { cn } from "@/components/ui/utils";

interface RoleBadge {
  label: string;
  text: string;
  bg: string;
  border: string;
}

interface Props {
  profile: Profile;
  canEdit?: boolean;
  onEdit?: () => void;
  roleBadge?: RoleBadge;
}

function normalizeUrl(url: string) {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function ProfileCard({ profile, canEdit, onEdit, roleBadge }: Props) {
  const contactRows = [
    { icon: <Mail className="w-4 h-4" />, val: profile.email, href: profile.email ? `mailto:${profile.email}` : undefined },
    { icon: <MapPin className="w-4 h-4" />, val: profile.location, href: undefined },
    { icon: <Globe className="w-4 h-4" />, val: profile.website, href: profile.website ? normalizeUrl(profile.website) : undefined },
  ].filter((row) => row.val);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] overflow-hidden h-fit">
      {/* Cover */}
      <div className="relative h-24 bg-gradient-to-br from-emerald-500/25 via-teal-500/10 to-transparent">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(52,211,153,0.35) 0%, transparent 45%), radial-gradient(circle at 85% 0%, rgba(45,212,191,0.25) 0%, transparent 40%)",
          }}
        />
        {canEdit && (
          <button
            onClick={onEdit}
            title="Editar perfil"
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/90 bg-black/30 hover:bg-black/45 backdrop-blur-sm border border-white/15 hover:border-white/30 transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editar</span>
          </button>
        )}
      </div>

      <div className="flex flex-col items-center text-center px-8 pb-8 -mt-12">
        <div className="relative mb-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-[#161B22] shadow-lg shadow-black/40 bg-[#0D1117]"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border-4 border-[#161B22] shadow-lg shadow-black/40 flex items-center justify-center text-2xl font-bold text-emerald-400">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-[3px] border-[#161B22]" />
        </div>

        <h2 className="text-xl font-bold text-white mb-0.5 leading-tight">{profile.name}</h2>
        {profile.alias && <p className="text-sm text-emerald-400 font-mono mb-3">{profile.alias}</p>}

        {/* Badges: role + member since */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-4">
          {roleBadge && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 border",
                roleBadge.text,
                roleBadge.bg,
                roleBadge.border
              )}
            >
              {roleBadge.label}
            </span>
          )}
          {profile.createdAt && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.04] border border-white/[0.08] rounded-full px-2.5 py-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              Miembro desde {profile.createdAt}
            </span>
          )}
        </div>

        {profile.bio && <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">{profile.bio}</p>}

        {contactRows.length > 0 && (
          <div className="w-full space-y-1 text-left border-t border-white/[0.06] pt-5">
            {contactRows.map((row) => {
              const content = (
                <>
                  <span className="flex-shrink-0 text-slate-500 group-hover:text-emerald-400 transition-colors">{row.icon}</span>
                  <span className="truncate">{row.val}</span>
                </>
              );
              return row.href ? (
                <a
                  key={row.val}
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-3 text-sm text-slate-300 hover:text-white px-2.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {content}
                </a>
              ) : (
                <div key={row.val} className="flex items-center gap-3 text-sm text-slate-300 px-2.5 py-2">
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}