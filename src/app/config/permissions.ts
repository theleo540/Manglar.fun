import type { AdminRole } from "@/types/admin";

/**
 * Tokens de permisos granulares.
 * Usar como PERMISSIONS.EDIT_PROFILE — nunca el string crudo.
 */
export const PERMISSIONS = {
  MANAGE_ADMINS: "manage_admins",
  MANAGE_SERVICES: "manage_services",
  EDIT_PROFILE: "edit_profile",
  VIEW_DASHBOARD: "view_dashboard",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Matriz de permisos por rol.
 * Super Admin tiene todos los permisos; Admin tiene un subconjunto.
 */
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  "super-admin": Object.values(PERMISSIONS) as Permission[],
  admin: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.EDIT_PROFILE],
};

/**
 * True si el rol dado tiene el permiso solicitado.
 *
 * Uso:
 *   hasPermission("super-admin", PERMISSIONS.MANAGE_ADMINS) // true
 *   hasPermission("admin",       PERMISSIONS.MANAGE_ADMINS) // false
 *   hasPermission(null,          PERMISSIONS.VIEW_DASHBOARD) // false (público)
 */
export function hasPermission(role: AdminRole | null, permission: Permission): boolean {
  if (!role) return false;
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission);
}
