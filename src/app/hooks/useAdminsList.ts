import { useState, useEffect } from "react";
import type { Admin } from "@/types/admin";
import { adminsService } from "@/services/adminsService";

/**
 * Lista de administradores que se muestra en la pestaña "Admins" del
 * Dashboard. Es informativa/editable desde la UI — NO controla permisos
 * reales (eso lo sigue haciendo AUTHORIZED_ADMINS en config/auth.ts vía
 * useAuth/useAdmin).
 */
export function useAdminsList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminsService.getAdmins().then((list) => {
      if (cancelled) return;
      setAdmins(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(admin: Admin): Promise<"created" | "updated"> {
    const isNew = !admins.some((a) => a.id === admin.id) || !admin.id;
    if (isNew) {
      const { id: _ignoredId, ...rest } = admin;
      const created = await adminsService.createAdmin(rest);
      setAdmins((prev) => [created, ...prev]);
      return "created";
    }
    const updated = await adminsService.updateAdmin(admin);
    setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    return "updated";
  }

  async function remove(id: string): Promise<void> {
    await adminsService.deleteAdmin(id);
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  }

  return { admins, loading, save, remove };
}
