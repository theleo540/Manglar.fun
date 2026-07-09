/**
 * Definiciones centralizadas de rutas.
 * Toda navegación en la app debe referenciar ROUTES.* — nunca strings sueltos.
 */
export const ROUTES = {
  HOME: "home",
  PROFILE: "profile",
  DASHBOARD: "dashboard",
  LEGAL_PRIVACIDAD: "legal-privacidad",
  LEGAL_TERMINOS: "legal-terminos",
  LEGAL_COOKIES: "legal-cookies",
  LEGAL_DMCA: "legal-dmca",
  NOT_FOUND: "not-found",
} as const;

/** Unión de todas las rutas válidas de la app. */
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];