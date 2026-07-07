import type { Admin, AdminRole, AdminStatus } from "@/types/admin";
import { FALLBACK_ADMINS } from "@/data/admins";
import { supabase } from "@/lib/supabase";

export const EMPTY_ADMIN: Omit<Admin, "id"> = {
  username: "",
  role: "admin" as AdminRole,
  avatar: "",
  version: "1.0.0",
  lastAccess: new Date().toISOString().slice(0, 10),
  status: "offline" as AdminStatus,
};

/** Convierte una fila de la tabla `admins` (snake_case) al tipo Admin (camelCase). */
function fromRow(row: Record<string, unknown>): Admin {
  return {
    id: row.id as string,
    username: (row.username as string) ?? "",
    role: (row.role as AdminRole) ?? "admin",
    avatar: (row.avatar as string) ?? "",
    version: (row.version as string) ?? "1.0.0",
    lastAccess: (row.last_access as string) ?? "",
    status: (row.status as AdminStatus) ?? "offline",
  };
}

/** Convierte un Admin (camelCase) a columnas de la tabla (snake_case). */
function toRow(a: Partial<Admin>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (a.username !== undefined) row.username = a.username;
  if (a.role !== undefined) row.role = a.role;
  if (a.avatar !== undefined) row.avatar = a.avatar;
  if (a.version !== undefined) row.version = a.version;
  if (a.lastAccess !== undefined) row.last_access = a.lastAccess;
  if (a.status !== undefined) row.status = a.status;
  return row;
}

export const adminsService = {
  /**
   * Trae el directorio de administradores desde Supabase. Esto es solo
   * informativo/visual (quién aparece en la pestaña "Admins"); el control
   * real de permisos sigue siendo AUTHORIZED_ADMINS en config/auth.ts.
   */
  async getAdmins(): Promise<Admin[]> {
    const { data, error } = await supabase.from("admins").select("*").order("username", { ascending: true });

    if (error || !data) {
      if (error) console.warn("[adminsService] usando datos de respaldo:", error.message);
      return [...FALLBACK_ADMINS];
    }
    return data.map(fromRow);
  },

  async createAdmin(data: Omit<Admin, "id">): Promise<Admin> {
    const { data: row, error } = await supabase.from("admins").insert(toRow(data)).select().single();
    if (error || !row) throw new Error(error?.message ?? "No se pudo crear el admin");
    return fromRow(row);
  },

  async updateAdmin(updated: Admin): Promise<Admin> {
    const { data: row, error } = await supabase.from("admins").update(toRow(updated)).eq("id", updated.id).select().single();
    if (error || !row) throw new Error(error?.message ?? "No se pudo actualizar el admin");
    return fromRow(row);
  },

  async deleteAdmin(id: string): Promise<void> {
    const { error } = await supabase.from("admins").delete().eq("id", id);
    if (error) throw new Error(error.message ?? "No se pudo eliminar el admin");
  },

  getEmptyAdmin(): Omit<Admin, "id"> {
    return { ...EMPTY_ADMIN };
  },
};
