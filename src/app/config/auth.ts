/**
 * Supabase + GitHub OAuth — control de acceso admin.
 *
 * Credenciales de Supabase van en .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY),
 * ver src/app/lib/supabase.ts.
 *
 * Emails autorizados y su rol.
 * Deben coincidir exactamente con el email principal de cada cuenta de GitHub.
 *
 * Roles:
 *   "super-admin"  →  acceso total (crear, editar, eliminar, dashboard)
 *   "admin"        →  acceso parcial (crear, editar, duplicar)
 */
export const AUTHORIZED_ADMINS: Record<string, "super-admin" | "admin"> = {
  "theleo540@gmail.com": "super-admin",
  "pabloloptam@gmail.com": "admin",
};
