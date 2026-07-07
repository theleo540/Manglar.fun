import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Calendar } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAdmin } from "@/hooks/useAdmin";
import { AUTHORIZED_ADMINS } from "@/config/auth";
import { PERMISSIONS } from "@/config/permissions";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants/roles";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { AccountEditModal } from "@/components/profile/AccountEditModal";
import { StatCard } from "@/components/cards/StatCard";
import { cn } from "@/components/ui/utils";
import { profileService } from "@/services/profileService";
import { AVATAR_PRESETS } from "@/constants/avatarPresets";
import type { Profile as ProfileData } from "@/types/profile";

function LoadingProfile() {
  return (
    <div className="min-h-screen px-6 pt-24 pb-16 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] h-[420px] animate-pulse" />
        <div className="h-32 rounded-2xl border border-white/[0.08] bg-[#161B22] animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Perfil de un usuario normal (no admin): no hay tabla de admins que
 * elegir, es SIEMPRE su propio perfil. Si todavía no existe una fila en
 * `profiles` para su email, se crea sola con lo que ya sabemos del login
 * (nombre, avatar de GitHub/Google) — así cualquiera que entre puede
 * actualizar sus datos desde el primer momento, sin que un admin lo dé
 * de alta a mano.
 */
function OwnAccountProfile({ user }: { user: { name: string; email: string; avatar: string } }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    profileService
      .getOrCreateProfile(user.email, { name: user.name, avatar: user.avatar || AVATAR_PRESETS[0].url })
      .then((p) => {
        if (!cancelled) {
          setProfile(p);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user.email]);

  async function handleSave(updates: Partial<ProfileData>) {
    if (!profile) return;
    const updated = await profileService.updateProfile(profile.ownerEmail, updates);
    setProfile(updated);
  }

  if (loading || !profile) return <LoadingProfile />;

  return (
    <div className="min-h-screen px-6 pt-24 pb-16 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-[320px_1fr] gap-8">
        <ProfileCard profile={profile} canEdit onEdit={() => setEditing(true)} />

        <div className="space-y-6">
          <StatCard icon={<Calendar className="w-4 h-4" />} label="Miembro desde" value={profile.createdAt || "—"} />

          <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] p-6">
            <h3 className="text-sm font-semibold text-white mb-2">Sobre este perfil</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Este es tu perfil de usuario. Desde "Editar" puedes actualizar tu nombre, correo, contraseña y elegir un
              ícono de perfil.
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editing && (
          <AccountEditModal
            profile={profile}
            onSave={async (updates) => {
              await handleSave(updates);
              setEditing(false);
            }}
            onClose={() => setEditing(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export function Profile() {
  const { user, isAdmin } = useAdmin();

  // Usuario logueado sin permisos de admin: ve y edita únicamente su
  // propia cuenta, sin selector de perfiles ni campos de administrador.
  if (user && !isAdmin) {
    return <OwnAccountProfile user={user} />;
  }

  return <AdminProfile />;
}

/** Perfil de administradores: selector entre perfiles públicos del ecosistema y edición completa (bio, redes, etc). */
function AdminProfile() {
  const { profiles: allProfiles, profile: rawProfile, selectedId, setSelectedId, loading, save } = useProfile();
  const { user, hasPermission } = useAdmin();

  // La tabla `profiles` ahora también guarda usuarios normales (cualquiera
  // que entra por GitHub/Google/correo). Aquí, en el perfil de admin, solo
  // nos interesa mostrar/seleccionar los perfiles que SÍ son admins según
  // AUTHORIZED_ADMINS — los usuarios normales se listan aparte en el
  // Dashboard (pestaña "Usuarios"), no aquí.
  const profiles = allProfiles.filter((p) => p.ownerEmail.toLowerCase() in AUTHORIZED_ADMINS);
  const profile = profiles.find((p) => p.id === selectedId) ?? profiles[0] ?? rawProfile;
  const [editing, setEditing] = useState(false);

  const canEdit = !!profile && !!user && user.email === profile.ownerEmail && hasPermission(PERMISSIONS.EDIT_PROFILE);

  if (loading || !profile) return <LoadingProfile />;

  return (
    <div className="min-h-screen px-6 pt-24 pb-16 max-w-5xl mx-auto">
      {/* Selector de perfil — solo se muestra si hay más de uno */}
      {profiles.length > 1 && (
        <div className="flex items-center gap-2 mb-6">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all border",
                selectedId === p.id
                  ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  : "text-slate-400 border-transparent hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <motion.div key={profile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-[320px_1fr] gap-8">
        <ProfileCard profile={profile} canEdit={canEdit} onEdit={() => setEditing(true)} />

        <div className="space-y-6">
          {user && (
            <div className="grid grid-cols-2 gap-4">
              {(() => {
                const roleKey = user.role as keyof typeof ROLE_COLORS;
                const c = ROLE_COLORS[roleKey];
                return (
                  <StatCard
                    icon={<Shield className="w-4 h-4" />}
                    label="Rol"
                    value={ROLE_LABELS[roleKey as keyof typeof ROLE_LABELS] ?? user.role}
                    sub={c ? undefined : undefined}
                  />
                );
              })()}
              <StatCard icon={<Calendar className="w-4 h-4" />} label="Miembro desde" value={profile.createdAt || "—"} />
            </div>
          )}

          <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] p-6">
            <h3 className="text-sm font-semibold text-white mb-2">Sobre este perfil</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Este perfil representa a un administrador del ecosistema Manglar. La información pública (bio, redes,
              ubicación) se edita desde la tarjeta de la izquierda si tienes permiso.
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editing && profile && (
          <ProfileEditModal profile={profile} onSave={(updates) => save(profile.ownerEmail, updates)} onClose={() => setEditing(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}