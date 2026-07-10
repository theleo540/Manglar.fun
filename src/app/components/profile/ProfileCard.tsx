import { Github, Instagram, Mail, MapPin, Globe, Calendar, Pencil } from "lucide-react";
import type { Profile } from "@/types/profile";
import { getExternalLinkTarget } from "../../utils/linkTarget";

interface Props {
  profile: Profile;
  canEdit?: boolean;
  onEdit?: () => void;
}

export function ProfileCard({ profile, canEdit, onEdit }: Props) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] p-8 flex flex-col items-center text-center h-fit relative">
      {canEdit && (
        <button
          onClick={onEdit}
          title="Editar perfil"
          className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Editar</span>
        </button>
      )}

      <div className="relative mb-5">
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/30" />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-2xl font-bold text-emerald-400">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#161B22]" />
      </div>

      <h2 className="text-xl font-bold text-white mb-0.5">{profile.name}</h2>
      <p className="text-sm text-emerald-400 font-mono mb-4">{profile.alias}</p>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">{profile.bio}</p>

      <div className="w-full space-y-3 text-left mb-6">
        {[
          { icon: <MapPin className="w-3.5 h-3.5" />, val: profile.location },
          { icon: <Globe className="w-3.5 h-3.5" />, val: profile.website },
          { icon: <Mail className="w-3.5 h-3.5" />, val: profile.email },
          { icon: <Calendar className="w-3.5 h-3.5" />, val: `Desde ${profile.createdAt}` },
        ]
          .filter((row) => row.val && row.val !== "Desde")
          .map((row) => (
            <div key={row.val} className="flex items-center gap-2.5 text-sm text-slate-400">
              <span className="text-slate-600">{row.icon}</span>
              {row.val}
            </div>
          ))}
      </div>

      <div className="flex gap-3 w-full">
        <a
          href={profile.github ? `https://github.com/${profile.github}` : undefined}
          target={getExternalLinkTarget()}
          rel="noreferrer"
          aria-disabled={!profile.github}
          className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all aria-disabled:opacity-30 aria-disabled:pointer-events-none"
        >
          <Github className="w-4 h-4" />
        </a>
        <a
          href={profile.instagram ? `https://instagram.com/${profile.instagram}` : undefined}
          target={getExternalLinkTarget()}
          rel="noreferrer"
          aria-disabled={!profile.instagram}
          className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all aria-disabled:opacity-30 aria-disabled:pointer-events-none"
        >
          <Instagram className="w-4 h-4" />
        </a>
        <a
          href={profile.email ? `mailto:${profile.email}` : undefined}
          aria-disabled={!profile.email}
          className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all aria-disabled:opacity-30 aria-disabled:pointer-events-none"
        >
          <Mail className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
