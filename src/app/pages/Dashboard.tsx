import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Users, Activity, BarChart3, Server, Edit2, Trash2, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import type { AdminTab, UserMode, Admin, ServiceItem } from "@/types/admin";
import { useServices } from "@/hooks/useServices";
import { useAdminsList } from "@/hooks/useAdminsList";
import { DASHBOARD_TAB_IDS, DASHBOARD_TAB_LABELS } from "@/constants/dashboard";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants/roles";
import { cn } from "@/components/ui/utils";
import { StatCard } from "@/components/cards/StatCard";
import { SvcDot } from "@/components/common/SvcDot";
import { ServiceModal } from "@/components/ui/ServiceModal";
import { AdminModal } from "@/components/ui/AdminModal";

interface Props {
  userMode: UserMode;
}

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: DASHBOARD_TAB_IDS.OVERVIEW, label: DASHBOARD_TAB_LABELS.overview, icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: DASHBOARD_TAB_IDS.ADMINS, label: DASHBOARD_TAB_LABELS.admins, icon: <Users className="w-3.5 h-3.5" /> },
  { id: DASHBOARD_TAB_IDS.SERVICES, label: DASHBOARD_TAB_LABELS.services, icon: <Server className="w-3.5 h-3.5" /> },
];

export function Dashboard({ userMode }: Props) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const isSuperAdmin = userMode === "super-admin";

  const { services, save: saveService, remove: removeService } = useServices();
  const { admins, save: saveAdmin, remove: removeAdmin } = useAdminsList();

  const [serviceModal, setServiceModal] = useState<ServiceItem | null>(null);
  const [adminModal, setAdminModal] = useState<Admin | null>(null);

  const svcOnline = services.filter((s) => s.status === "online").length;
  const svcOffline = services.filter((s) => s.status === "offline").length;
  const uptimes = services.map((s) => parseFloat(s.uptime)).filter((n) => !Number.isNaN(n));
  const averageUptime = uptimes.length ? uptimes.reduce((a, b) => a + b, 0) / uptimes.length : 0;

  function handleSaveService(service: ServiceItem) {
    saveService(service)
      .then((result) => {
        toast.success(result === "created" ? "Servicio creado" : "Servicio actualizado");
        setServiceModal(null);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "No se pudo guardar el servicio"));
  }

  function handleDeleteService(id: string) {
    removeService(id)
      .then(() => toast.success("Servicio eliminado"))
      .catch((err) => toast.error(err instanceof Error ? err.message : "No se pudo eliminar el servicio"));
  }

  function handleSaveAdmin(admin: Admin) {
    saveAdmin(admin)
      .then((result) => {
        toast.success(result === "created" ? "Admin creado" : "Admin actualizado");
        setAdminModal(null);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "No se pudo guardar el admin"));
  }

  function handleDeleteAdmin(id: string) {
    removeAdmin(id)
      .then(() => toast.success("Admin eliminado"))
      .catch((err) => toast.error(err instanceof Error ? err.message : "No se pudo eliminar el admin"));
  }

  return (
    <div className="min-h-screen px-6 pt-24 pb-16 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="mb-1">
              {(() => {
                const role = isSuperAdmin ? "super-admin" : ("admin" as const);
                const c = ROLE_COLORS[role];
                return (
                  <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold border", c.text, c.bg, c.border)}>
                    {ROLE_LABELS[role]}
                  </span>
                );
              })()}
            </div>
            <h1 className="text-2xl font-bold text-white">Panel de Administrador</h1>
          </div>

          {tab === "admins" && isSuperAdmin && (
            <button
              onClick={() => setAdminModal({ id: "", username: "", role: "admin", avatar: "", version: "1.0.0", lastAccess: "", status: "offline" })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-[#0D1117] text-sm font-semibold hover:bg-emerald-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Nuevo Admin
            </button>
          )}

          {tab === "services" && isSuperAdmin && (
            <button
              onClick={() => setServiceModal({ id: "", project: "", status: "online", uptime: "100%", version: "1.0.0", lastDeploy: "" })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-[#0D1117] text-sm font-semibold hover:bg-emerald-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Nuevo Servicio
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl border border-white/[0.06] bg-[#161B22] w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                tab === t.id ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users className="w-4 h-4" />} label="Administradores" value={admins.length} />
                <StatCard icon={<CheckCircle2 className="w-4 h-4" />} label="Servicios online" value={svcOnline} />
                <StatCard icon={<AlertCircle className="w-4 h-4" />} label="Servicios offline" value={svcOffline} />
                <StatCard icon={<Activity className="w-4 h-4" />} label="Uptime promedio" value={`${averageUptime.toFixed(1)}%`} />
              </div>
            </motion.div>
          )}

          {tab === "admins" && (
            <motion.div key="admins" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="rounded-xl border border-white/[0.08] bg-[#161B22] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Admin", "Rol", "Estado", "Último acceso", "Versión", ...(isSuperAdmin ? ["Acciones"] : [])].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((a) => (
                      <tr key={a.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img src={a.avatar} alt={a.username} className="w-9 h-9 rounded-xl object-cover border border-white/[0.08]" />
                              <span
                                className={cn(
                                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#161B22]",
                                  a.status === "online" ? "bg-emerald-400" : "bg-slate-600"
                                )}
                              />
                            </div>
                            <p className="text-sm font-medium text-white">{a.username}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {(() => {
                            const c = ROLE_COLORS[a.role];
                            return (
                              <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold border", c.text, c.bg, c.border)}>
                                {ROLE_LABELS[a.role]}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn("text-xs font-medium", a.status === "online" ? "text-emerald-400" : "text-slate-500")}>
                            {a.status === "online" ? "● Online" : "● Offline"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{a.lastAccess}</td>
                        <td className="px-5 py-4 text-xs font-mono text-slate-600">{a.version}</td>
                        {isSuperAdmin && (
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setAdminModal(a)} className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteAdmin(a.id)} className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === "services" && (
            <motion.div key="services" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="rounded-xl border border-white/[0.08] bg-[#161B22] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Servicio", "Estado", "Uptime", "Versión", "Último deploy", ...(isSuperAdmin ? ["Acciones"] : [])].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                              <Server className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            <p className="text-sm font-medium text-white">{s.project}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <SvcDot status={s.status} />
                        </td>
                        <td className="px-5 py-4 text-sm font-mono text-slate-300">{s.uptime}</td>
                        <td className="px-5 py-4 text-xs font-mono text-slate-500">v{s.version}</td>
                        <td className="px-5 py-4 text-xs text-slate-500">{s.lastDeploy}</td>
                        {isSuperAdmin && (
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setServiceModal(s)} className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteService(s.id)} className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {serviceModal && <ServiceModal initial={serviceModal} onSave={handleSaveService} onClose={() => setServiceModal(null)} />}
        {adminModal && <AdminModal initial={adminModal} onSave={handleSaveAdmin} onClose={() => setAdminModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
