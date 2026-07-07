import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types/profile";
import { cn } from "@/components/ui/utils";

interface Props {
  profile: Profile;
  onSave: (updates: Partial<Profile>) => Promise<void>;
  onClose: () => void;
}

export function ProfileEditModal({ profile, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    name: profile.name,
    alias: profile.alias,
    bio: profile.bio,
    avatar: profile.avatar,
    website: profile.website,
    email: profile.email,
    github: profile.github,
    instagram: profile.instagram ?? "",
    location: profile.location,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      toast.success("Perfil actualizado");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
  }

  const input =
    "w-full px-3 py-2.5 rounded-lg bg-[#0D1117] border border-white/[0.08] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#161B22] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h2 className="text-base font-semibold text-white">Editar perfil</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Nombre *</label>
              <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Alias</label>
              <input className={input} value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} placeholder="@usuario" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1.5">Bio</label>
              <textarea
                className={cn(input, "resize-none")}
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Cuéntanos sobre ti..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1.5">URL de avatar</label>
              <input className={input} value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Ubicación</label>
              <input className={input} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ciudad, País" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Sitio web</label>
              <input className={input} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Email de contacto</label>
              <input className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">GitHub (usuario)</label>
              <input className={input} value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="usuario" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1.5">Instagram (usuario)</label>
              <input className={input} value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="usuario" />
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
