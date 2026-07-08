import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Users, BarChart3, Server, Edit2, Trash2, Plus, CheckCircle2, AlertCircle, Eye, Globe, UserCircle2 } from "lucide-react";
import type { AdminTab, UserMode, Admin } from "@/types/admin";
import { useAdminsList } from "@/hooks/useAdminsList";
import { useEcosystemWidgets } from "@/hooks/useEcosystemWidgets";
import { ECOSYSTEM_PROJECTS } from "@/config/ecosystem";
import { fmt } from "@/utils/formatters";
import { DASHBOARD_TAB_IDS, DASHBOARD_TAB_LABELS } from "@/constants/dashboard";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants/roles";
import { AUTHORIZED_ADMINS } from "@/config/auth";
import { profileService } from "@/services/profileService";
import type { Profile } from "@/types/profile";
import { cn } from "@/components/ui/utils";
import { StatCard } from "@/components/cards/StatCard";
import { SvcDot } from "@/components/common/SvcDot";
import { AdminModal } from "@/components/ui/AdminModal";

interface Props {
  userMode: UserMode;
  siteVisits?: number;
}

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: DASHBOARD_TAB_IDS.OVERVIEW, label: DASHBOARD_TAB_LABELS.overview, icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: DASHBOARD_TAB_IDS.ADMINS, label: DASHBOARD_TAB_LABELS.admins, icon: <Users className="w-3.5 h-3.5" /> },
  { id: DASHBOARD_TAB_IDS.USERS, label: DASHBOARD_TAB_LABELS.users, icon: <UserCircle2 className="w-3.5 h-3.5" /> },
  { id: DASHBOARD_TAB_IDS.SERVICES, label: DASHBOARD_TAB_LABELS.services, icon: <Server className="w-3.5 h-3.5" /> },
];

export function Dashboard({ userMode, siteVisits = 0 }: Props) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const isSuperAdmin = userMode === "super-admin";

  const { admins, save: saveAdmin, remove: removeAdmin } = useAdminsList();

  // "Servicios" ya NO es una tabla editable a mano: son los proyectos
  // reales del Ecosistema Manglar (config/ecosystem.ts). Cada uno se
  // marca online/offline según si su /api/widget respondió — nada se
  // crea manualmente, por eso no hay botón "+ Nuevo Servicio".
  const { projects: liveProjects, checked } = useEcosystemWidgets();
  const services = ECOSYSTEM_PROJECTS.map((p) => {
    const live = liveProjects.find((w) => w.project === p.slug);
    return {
      slug: p.slug,
      label: p.label,
      domain: live?.domain ?? p.widgetUrl.replace(/^https?:\/\//, "").split("/")[0],
      status: live ? ("online" as const) : ("offline" as const),
    };
  });

  const [adminModal, setAdminModal] = useState<Admin | null>(null);

  // Usuarios normales (no admins): cualquier fila de `profiles` cuyo
  // owner_email NO esté en AUTHORIZED_ADMINS. Se cargan aparte de
  // useAdminsList, que es solo para la tabla admin_roles/admins.
  const [users, setUsers] = useState<Profile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    profileService.getProfiles().then((all) => {
      if (cancelled) return;
      setUsers(all.filter((p) => !(p.ownerEmail.toLowerCase() in AUTHORIZED_ADMINS)));
      setUsersLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const svcOnline = services.filter((s) => s.status === "online").length;
  const svcOffline = services.filter((s) => s.status === "offline").length;

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
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard icon={<Users className="w-4 h-4" />} label="Administradores" value={admins.length} />
                <StatCard icon={<UserCircle2 className="w-4 h-4" />} label="Usuarios" value={users.length} />
                <StatCard icon={<Eye className="w-4 h-4" />} label="Visitas totales" value={fmt(siteVisits)} />
                <StatCard icon={<CheckCircle2 className="w-4 h-4" />} label="Servicios online" value={svcOnline} />
                <StatCard icon={<AlertCircle className="w-4 h-4" />} label="Servicios offline" value={svcOffline} />
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

          {tab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-xs text-slate-500 mb-3">
                Cualquiera que se registra en el sitio (GitHub, Google o correo) sin ser admin aparece aquí.
              </p>
              <div className="rounded-xl border border-white/[0.08] bg-[#161B22] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Usuario", "Nombre", "Correo", "Método", "Desde"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover border border-white/[0.08]" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                                {(u.name || u.ownerEmail).charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-white">{u.name || "—"}</td>
                        <td className="px-5 py-4 text-xs text-slate-400">{u.email || u.ownerEmail}</td>
                        <td className="px-5 py-4">
                          {(() => {
                            const p = u.provider || "email";
                            const styles: Record<string, string> = {
                              github: "text-slate-300 bg-white/[0.06] border-white/[0.12]",
                              google: "text-blue-300 bg-blue-500/10 border-blue-500/30",
                              email: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
                            };
                            const labels: Record<string, string> = { github: "GitHub", google: "Google", email: "Correo" };
                            return (
                              <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium border", styles[p] ?? styles.email)}>
                                {labels[p] ?? "Correo"}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{u.createdAt ? u.createdAt.slice(0, 10) : "—"}</td>
                      </tr>
                    ))}
                    {!usersLoading && users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-6 text-center text-sm text-slate-500">
                          Todavía no se ha registrado ningún usuario normal.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === "services" && (
            <motion.div key="services" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-xs text-slate-500 mb-3">
                Esto es el Ecosistema Manglar tal cual está configurado en <code className="text-slate-400">config/ecosystem.ts</code>.
                No hay creación manual: agregar un proyecto nuevo ahí (con su <code className="text-slate-400">/api/widget</code> real)
                lo hace aparecer aquí solo.
              </p>
              <div className="rounded-xl border border-white/[0.08] bg-[#161B22] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Servicio", "Estado", "Dominio"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.slug} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                              <Server className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            <p className="text-sm font-medium text-white">{s.label}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <SvcDot status={checked ? s.status : "maintenance"} />
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <Globe className="w-3 h-3" /> {s.domain}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {services.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-6 text-center text-sm text-slate-500">
                          No hay proyectos configurados todavía en el Ecosistema Manglar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {adminModal && <AdminModal initial={adminModal} onSave={handleSaveAdmin} onClose={() => setAdminModal(null)} />}
      </AnimatePresence>
    </div>
  );
}