import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { ServiceItem, ServiceStatus } from "@/types/admin";
import { cn } from "@/components/ui/utils";
import { EMPTY_SERVICE } from "@/services/serviceService";
import { toast } from "sonner";

interface Props {
  initial: ServiceItem | null;
  onSave: (s: ServiceItem) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: ServiceStatus[] = ["online", "maintenance", "offline"];

export function ServiceModal({ initial, onSave, onClose }: Props) {
  const isNew = !initial?.id;

  const [form, setForm] = useState<Omit<ServiceItem, "id">>({
    ...EMPTY_SERVICE,
    ...(initial ? { ...initial } : {}),
  });

  function handleSave() {
    if (!form.project.trim()) {
      toast.error("El nombre del servicio es requerido");
      return;
    }
    const service: ServiceItem = { id: initial?.id ?? "", ...form };
    onSave(service);
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
          <h2 className="text-base font-semibold text-white">{isNew ? "Nuevo Servicio" : "Editar Servicio"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1.5">Nombre del servicio *</label>
              <input className={input} value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="Manglar Stream" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Estado</label>
              <select className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ServiceStatus })}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Uptime</label>
              <input className={input} value={form.uptime} onChange={(e) => setForm({ ...form, uptime: e.target.value })} placeholder="99.9%" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Versión</label>
              <input className={input} value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="1.0.0" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Último deploy</label>
              <input
                type="date"
                className={cn(input, "[color-scheme:dark]")}
                value={form.lastDeploy}
                onChange={(e) => setForm({ ...form, lastDeploy: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/[0.08]">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-white/[0.08] text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all">
            Cancelar
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 text-[#0D1117] text-sm font-semibold hover:bg-emerald-400 transition-colors">
            {isNew ? "Crear Servicio" : "Guardar Cambios"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
