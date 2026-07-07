import { supabase } from "@/lib/supabase";

/**
 * Contador global de visitas del sitio (real, vía Supabase).
 *
 * Requiere en Supabase:
 *   1. Tabla `site_stats` con una sola fila (id = 1, total_visits int8 default 0).
 *   2. Función RPC `increment_site_visit` que haga UPDATE site_stats
 *      SET total_visits = total_visits + 1 WHERE id = 1 RETURNING total_visits.
 *
 * Si la tabla/función todavía no existen, esto no rompe la app: se
 * registra un warning en consola y el contador simplemente muestra 0
 * hasta que se cree la infraestructura en Supabase.
 */
export const analyticsService = {
  /** Suma +1 al contador global y devuelve el nuevo total, o null si falló. */
  async incrementSiteVisit(): Promise<number | null> {
    const { data, error } = await supabase.rpc("increment_site_visit");
    if (error) {
      console.warn("[analyticsService] no se pudo registrar la visita del sitio:", error.message);
      return null;
    }
    return data as number;
  },

  /** Lee el contador global de visitas sin incrementarlo. */
  async getSiteVisits(): Promise<number> {
    const { data, error } = await supabase.from("site_stats").select("total_visits").eq("id", 1).single();
    if (error || !data) return 0;
    return Number(data.total_visits ?? 0);
  },
};
