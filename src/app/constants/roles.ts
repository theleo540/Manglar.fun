import type { AdminRole } from "@/types/admin";

/** Constantes de rol con nombre. Referenciar ROLES.* en vez de strings crudos. */
export const ROLES = {
  SUPER_ADMIN: "super-admin" as AdminRole,
  ADMIN: "admin" as AdminRole,
} as const;

/** Etiquetas visibles por rol — usadas en badges y tablas. */
export const ROLE_LABELS: Record<AdminRole, string> = {
  "super-admin": "Super Admin",
  admin: "Admin",
};

/** Tokens de color Tailwind por rol — consistencia visual en toda la UI. */
export const ROLE_COLORS: Record<AdminRole, { text: string; bg: string; border: string }> = {
  "super-admin": {
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/25",
  },
  admin: {
    text: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/25",
  },
};
