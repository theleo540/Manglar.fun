import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProfile } from "@/hooks/useProfile";
import { useAdmin } from "@/hooks/useAdmin";
import { AUTHORIZED_ADMINS } from "@/config/auth";
import { PERMISSIONS } from "@/config/permissions";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants/roles";
import { BackToOrigin } from "@/components/BackToOrigin";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { CreatorCard } from "@/components/profile/CreatorCard";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { AccountEditModal } from "@/components/profile/AccountEditModal";
import { EcosystemActivitySection, GocutActivitySection } from "@/components/profile/EcosystemActivitySection";
import { cn } from "@/components/ui/utils";
import { profileService } from "@/services/profileService";
import { AVATAR_PRESETS } from "@/constants/avatarPresets";
import type { Profile as ProfileData } from "@/types/profile";

function LoadingProfile() {
  return (
    <div className="min-h-screen px-6 pt-24 pb-16 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] h-[420px] animate-pulse" />
        <div className="hidden lg:block rounded-2xl border border-white/[0.08] bg-[#161B22] h-[280px] animate-pulse" />
      </div>
      <div className="h-64 rounded-2xl border border-white/[0.08] bg-[#161B22] animate-pulse mt-8" />
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
  const [creator, setCreator] = useState<ProfileData | null>(null);

  useEffect(() => {
    let cancelled = false;
    profileService
      .getOrCreateProfile(user.email, { name: user.name, avatar: user.avatar || AVATAR_PRESETS[0].url, provider: user.provider })
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

  // Perfil del super-admin (el creador del ecosistema) — se muestra siempre
  // en el perfil de cualquier usuario normal, para que sepan quién está
  // detrás del sitio y puedan escribirle por Instagram.
  useEffect(() => {
    let cancelled = false;
    const superAdminEmail = Object.entries(AUTHORIZED_ADMINS).find(([, role]) => role === "super-admin")?.[0];
    if (!superAdminEmail) return;
    profileService.getProfiles().then((list) => {
      if (cancelled) return;
      const found = list.find((p) => p.ownerEmail.toLowerCase() === superAdminEmail.toLowerCase());
      if (found) setCreator(found);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(updates: Partial<ProfileData>) {
    if (!profile) return;
    const updated = await profileService.updateProfile(profile.ownerEmail, updates);
    setProfile(updated);
  }

  if (loading || !profile) return <LoadingProfile />;

  // El super-admin ya está viendo su propio perfil como dueño de la
  // cuenta — no tiene sentido repetir su misma tarjeta a la derecha.
  const showCreator = creator && creator.ownerEmail.toLowerCase() !== user.email.toLowerCase();

  return (
    <div className="min-h-screen px-6 pt-24 pb-16 max-w-5xl mx-auto">
      <BackToOrigin />
      <h1 className="text-xl font-bold text-white mb-6">Perfil</h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <ProfileCard profile={profile} canEdit onEdit={() => setEditing(true)} />
          {showCreator && creator && (
            <div className="lg:sticky lg:top-24">
              <CreatorCard profile={creator} />
            </div>
          )}
        </div>

        <div className="space-y-6 min-w-0">
          <EcosystemActivitySection ownerEmail={user.email} />
          <GocutActivitySection ownerEmail={user.email} />
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

  // Rol del DUEÑO del perfil mostrado (no del usuario que está mirando) —
  // así el badge en la tarjeta siempre refleja a quién pertenece.
  const adminRoleKey = profile
    ? (AUTHORIZED_ADMINS[profile.ownerEmail.toLowerCase() as keyof typeof AUTHORIZED_ADMINS] as keyof typeof ROLE_COLORS | undefined)
    : undefined;

  // Perfil del super-admin (creador del ecosistema). Si alguien entra a
  // /profile SIN sesión iniciada, igual debe ver esta tarjeta para saber
  // quién está detrás del sitio y poder escribirle por Instagram.
  const superAdminEmail = Object.entries(AUTHORIZED_ADMINS).find(([, r]) => r === "super-admin")?.[0];
  const creator = profiles.find((p) => p.ownerEmail.toLowerCase() === superAdminEmail);

  if (loading || !profile) return <LoadingProfile />;

  const showCreator = !user && !!creator;

  return (
    <div className="min-h-screen px-6 pt-24 pb-16 max-w-5xl mx-auto">
      <BackToOrigin />
      <h1 className="text-xl font-bold text-white mb-6">Perfil</h1>
      {/* Selector de perfil — solo se muestra si hay más de uno */}
      {profiles.length > 1 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
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

      <motion.div key={profile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <ProfileCard
            profile={profile}
            canEdit={canEdit}
            onEdit={() => setEditing(true)}
            roleBadge={
              adminRoleKey && ROLE_COLORS[adminRoleKey]
                ? { label: ROLE_LABELS[adminRoleKey], ...ROLE_COLORS[adminRoleKey] }
                : undefined
            }
          />
          {showCreator && creator && (
            <div className="lg:sticky lg:top-24">
              <CreatorCard profile={creator} />
            </div>
          )}
        </div>

        <div className="space-y-6 min-w-0">
          {user && profile.ownerEmail === user.email && (
            <>
              <EcosystemActivitySection ownerEmail={user.email} />
              <GocutActivitySection ownerEmail={user.email} />
            </>
          )}
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