import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Calendar } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAdmin } from "@/hooks/useAdmin";
import { PERMISSIONS } from "@/config/permissions";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants/roles";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { StatCard } from "@/components/cards/StatCard";
import { cn } from "@/components/ui/utils";

export function Profile() {
  const { profiles, profile, selectedId, setSelectedId, loading, save } = useProfile();
  const { user, hasPermission } = useAdmin();
  const [editing, setEditing] = useState(false);

  const canEdit = !!profile && !!user && user.email === profile.ownerEmail && hasPermission(PERMISSIONS.EDIT_PROFILE);

  if (loading || !profile) {
    return (
      <div className="min-h-screen px-6 pt-24 pb-16 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          <div className="rounded-2xl border border-white/[0.08] bg-[#161B22] h-[420px] animate-pulse" />
          <div className="h-32 rounded-2xl border border-white/[0.08] bg-[#161B22] animate-pulse" />
        </div>
      </div>
    );
  }

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
                const c = ROLE_COLORS[user.role];
                return (
                  <StatCard
                    icon={<Shield className="w-4 h-4" />}
                    label="Rol"
                    value={ROLE_LABELS[user.role]}
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
