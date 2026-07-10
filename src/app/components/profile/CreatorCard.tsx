import { Instagram } from "lucide-react";
import type { Profile } from "@/types/profile";
import { getExternalLinkTarget } from "../../utils/linkTarget";

interface Props {
  profile: Profile;
}

/**
 * Tarjeta que muestra al creador/super-admin del ecosistema dentro del
 * perfil de un usuario normal. El objetivo es que cualquiera que entre
 * sepa quién está detrás del sitio y tenga una forma directa de
 * contactarlo (Instagram).
 */
export function CreatorCard({ profile }: Props) {
  return (
    <div className="rounded-2xl border border-red-400/20 bg-[#161B22] p-6 flex flex-col items-center text-center">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-red-400 bg-red-400/10 border border-red-400/25 rounded-full px-2.5 py-1 mb-4">
        Super Admin · Creador del ecosistema
      </span>

      <div className="relative mb-4">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-red-400/30"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-red-400/10 border-2 border-red-400/30 flex items-center justify-center text-lg font-bold text-red-400">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <h3 className="text-base font-bold text-white mb-0.5">{profile.name}</h3>
      {profile.alias && <p className="text-xs text-emerald-400 font-mono mb-3">{profile.alias}</p>}

      <p className="text-xs text-slate-400 leading-relaxed mb-5">
        Este ecosistema digital es mío. Si tienes dudas, sugerencias o quieres contactarme, escríbeme por Instagram.
      </p>

      <a
        href={profile.instagram ? `https://instagram.com/${profile.instagram}` : undefined}
        target={getExternalLinkTarget()}
        rel="noreferrer"
        aria-disabled={!profile.instagram}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition-all aria-disabled:opacity-30 aria-disabled:pointer-events-none"
      >
        <Instagram className="w-4 h-4" />
        Escríbeme por Instagram
      </a>
    </div>
  );
}