import type { AdminTab } from "@/types/admin";

/**
 * Identificadores y etiquetas de tabs del Dashboard.
 * Los íconos se agregan a nivel de componente (Dashboard.tsx).
 */
export const DASHBOARD_TAB_IDS = {
  OVERVIEW: "overview" as AdminTab,
  ADMINS: "admins" as AdminTab,
  SERVICES: "services" as AdminTab,
} as const;

export const DASHBOARD_TAB_LABELS: Record<AdminTab, string> = {
  overview: "Resumen",
  admins: "Admins",
  services: "Servicios",
};
