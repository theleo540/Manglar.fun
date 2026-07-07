/**
 * Definiciones centralizadas de rutas.
 * Toda navegación en la app debe referenciar ROUTES.* — nunca strings sueltos.
 */
export const ROUTES = {
  HOME: "home",
  PROFILE: "profile",
  DASHBOARD: "dashboard",
} as const;

/** Unión de todas las rutas válidas de la app. */
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
