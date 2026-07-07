import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Github, LayoutDashboard, UserCircle2, LogOut, X } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { ROUTES, type AppRoute } from "@/config/routes";

/**
 * Botón flotante y discreto (esquina inferior derecha) para acceso admin:
 * login con GitHub vía Supabase, y accesos a /profile y /dashboard.
 *
 * A propósito NO está integrado en el Navbar público — eso se deja para
 * después. Este es un punto de entrada independiente, solo para admins.
 */
export function AdminEntry({ navigate }: { navigate: (route: AppRoute) => void }) {
  const { user, isAdmin, login, logout, loading } = useAdmin();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-14 right-0 w-56 rounded-xl border border-white/[0.1] bg-[#161B22] shadow-2xl overflow-hidden"
          >
            {isAdmin && user ? (
              <div className="p-1.5">
                <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xs text-emerald-400">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setOpen(false); navigate(ROUTES.PROFILE); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <UserCircle2 className="w-4 h-4" /> Perfil
                </button>
                <button
                  onClick={() => { setOpen(false); navigate(ROUTES.DASHBOARD); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <button
                  onClick={() => { setOpen(false); logout(); navigate(ROUTES.HOME); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="p-3">
                <p className="text-xs text-slate-500 mb-2.5 px-1">Acceso solo para administradores</p>
                <button
                  onClick={login}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-sm text-white transition-colors"
                >
                  <Github className="w-4 h-4" /> Entrar con GitHub
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        title="Acceso admin"
        className="w-10 h-10 rounded-full border border-white/[0.08] bg-[#161B22]/80 backdrop-blur text-slate-500 hover:text-emerald-400 hover:border-emerald-400/30 flex items-center justify-center transition-all shadow-lg"
      >
        {open ? <X className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
      </button>
    </div>
  );
}
