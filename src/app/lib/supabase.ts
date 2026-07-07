/**
 * Cliente de Supabase — instancia única para toda la app.
 *
 * Importa desde aquí en cualquier hook o servicio:
 *   import { supabase } from "@/lib/supabase";
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[supabase] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en el .env — " +
    "el login de admins y el perfil no van a funcionar hasta que las configures."
  );
}

export const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_ANON_KEY ?? "", {
  auth: {
    persistSession: true,    // mantiene la sesión aunque recargues
    autoRefreshToken: true,  // refresca el token antes de que expire
    detectSessionInUrl: true, // necesario para el callback OAuth de GitHub
  },
});
