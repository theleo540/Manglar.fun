import { useState } from "react";
import { motion } from "motion/react";
import { X, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/profile";
import { AVATAR_PRESETS } from "@/constants/avatarPresets";
import { cn } from "@/components/ui/utils";

interface Props {
  profile: Profile;
  onSave: (updates: Partial<Profile>) => Promise<void>;
  onClose: () => void;
}

/**
 * Editor de cuenta para usuarios normales (no admins): solo nombre,
 * correo, contraseña y un avatar preestablecido (sin URL/subida libre).
 * Los campos de admin (bio, redes, ubicación, etc.) viven en
 * ProfileEditModal y no aplican aquí.
 */
export function AccountEditModal({ profile, onSave, onClose }: Props) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email || profile.ownerEmail);
  const [avatar, setAvatar] = useState(profile.avatar || AVATAR_PRESETS[0].url);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const input =
    "w-full px-3 py-2.5 rounded-lg bg-[#0D1117] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors";

  async function handleSave() {
    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    if (password && password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setSaving(true);
    try {
      // Correo y/o contraseña se actualizan en Supabase Auth (afecta el
      // login real); nombre y avatar se guardan en la tabla `profiles`.
      if (password || email !== (profile.email || profile.ownerEmail)) {
        const authUpdates: { email?: string; password?: string } = {};
        if (email && email !== (profile.email || profile.ownerEmail)) authUpdates.email = email;
        if (password) authUpdates.password = password;
        const { error } = await supabase.auth.updateUser(authUpdates);
        if (error) throw new Error(error.message);
      }

      await onSave({ name, email, avatar });
      toast.success("Cuenta actualizada");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo actualizar la cuenta");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#161B22] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h2 className="text-base font-semibold text-white">Mis datos</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Nombre *</label>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Correo</label>
            <input type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Nueva contraseña</label>
            <input
              type="password"
              className={input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Dejar en blanco para no cambiarla"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Ícono de perfil</label>
            <div className="grid grid-cols-4 gap-2.5">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setAvatar(preset.url)}
                  title={preset.label}
                  className={cn(
                    "relative rounded-xl overflow-hidden border-2 transition-all aspect-square",
                    avatar === preset.url ? "border-emerald-400" : "border-transparent hover:border-white/20"
                  )}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  {avatar === preset.url && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Check className="w-5 h-5 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-lg border border-white/[0.08] text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 text-[#0D1117] text-sm font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
