import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import type { AppRoute } from "@/config/routes";
import { ROUTES } from "@/config/routes";

/**
 * Página 404 — se muestra cuando la URL no coincide con ninguna ruta
 * conocida (ver getPageFromUrl en App.tsx). Junto con `public/_redirects`
 * (que evita que Netlify devuelva su propio 404 de servidor y en vez de
 * eso sirva index.html), esto le da control total a la app sobre qué
 * mostrar cuando la ruta no existe.
 */
export function NotFound({ navigate }: { navigate: (route: AppRoute) => void }) {
  return (
    <div className="min-h-screen px-6 pt-24 pb-16 max-w-2xl mx-auto flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-400/10 border border-red-400/25 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>

        <p className="text-6xl font-bold text-white/10 leading-none mb-2">404</p>
        <h1 className="text-xl font-bold text-white mb-2">Página no encontrada</h1>
        <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm">
          La página que buscas no existe o fue movida. Verifica la URL o vuelve al inicio.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 border border-white/[0.08] hover:bg-white/[0.04] hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </button>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/15 transition-all"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </button>
        </div>
      </motion.div>
    </div>
  );
}