import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { Admin, AdminRole, AdminStatus } from "@/types/admin";
import { cn } from "@/components/ui/utils";
import { EMPTY_ADMIN } from "@/services/adminsService";
import { toast } from "sonner";

interface Props {
  initial: Admin | null;
  onSave: (a: Admin) => void;
  onClose: () => void;
}

const ROLE_OPTIONS: AdminRole[] = ["admin", "super-admin"];
const STATUS_OPTIONS: AdminStatus[] = ["online", "offline"];

export function AdminModal({ initial, onSave, onClose }: Props) {
  const isNew = !initial?.id;

  const [form, setForm] = useState<Omit<Admin, "id">>({
    ...EMPTY_ADMIN,
    ...(initial ? { ...initial } : {}),
  });

  function handleSave() {
    if (!form.username.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    const admin: Admin = { id: initial?.id ?? "", ...form };
    onSave(admin);
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
          <h2 className="text-base font-semibold text-white">{isNew ? "Nuevo Admin" : "Editar Admin"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1.5">Nombre *</label>
              <input className={input} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Pablo" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Rol</label>
              <select className={input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Estado</label>
              <select className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AdminStatus })}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1.5">URL de Avatar</label>
              <input className={input} value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Versión</label>
              <input className={input} value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="2.0.0-admin" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Último acceso</label>
              <input
                type="date"
                className={cn(input, "[color-scheme:dark]")}
                value={form.lastAccess}
                onChange={(e) => setForm({ ...form, lastAccess: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/[0.08]">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-white/[0.08] text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all">
            Cancelar
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 text-[#0D1117] text-sm font-semibold hover:bg-emerald-400 transition-colors">
            {isNew ? "Crear Admin" : "Guardar Cambios"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
