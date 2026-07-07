/**
 * Storage adapter para Supabase Auth que usa cookies en vez de localStorage,
 * con Domain=.manglar.fun para que la sesión viaje entre TODOS los
 * subdominios (manglar.fun, wc2026streams.manglar.fun, futuros: nba.manglar.fun, etc).
 *
 * localStorage es por-origin (cada subdominio tiene el suyo), por eso no
 * sirve para SSO entre subdominios. Cookies con Domain=.manglar.fun sí,
 * porque el navegador las manda automáticamente a cualquier *.manglar.fun.
 *
 * IMPORTANTE: este archivo debe ser IDÉNTICO en todos los repos
 * (Manglar, WC2026, y los que vengan) — mismo cookie name, mismo Domain.
 * Si lo cambias en uno, cámbialo en todos o se rompe el SSO.
 */

const COOKIE_DOMAIN = ".manglar.fun";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 año (Supabase igual refresca el token solo)

// En local (localhost, *.netlify.app de preview, etc.) Domain=.manglar.fun
// no aplica y el navegador rechazaría/ignoraría la cookie con ese dominio.
// Detectamos eso y en ese caso no forzamos el Domain, para que dev/previews
// sigan funcionando (con cookie normal, sin compartir entre subdominios).
function isManglarDomain(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.endsWith("manglar.fun");
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const domainPart = isManglarDomain() ? `; Domain=${COOKIE_DOMAIN}` : "";
  const securePart = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${MAX_AGE_SECONDS}` +
    `${domainPart}; SameSite=Lax${securePart}`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  const domainPart = isManglarDomain() ? `; Domain=${COOKIE_DOMAIN}` : "";
  document.cookie = `${name}=; Path=/; Max-Age=0${domainPart}; SameSite=Lax`;
}

/**
 * Cumple la interfaz `Storage`-like que pide `auth.storage` de supabase-js
 * (getItem/setItem/removeItem, todos síncronos u opcionalmente async).
 *
 * Nota sobre tamaño: un access_token + refresh_token de Supabase puede
 * pesar ~800-1200 bytes. Las cookies aguantan hasta ~4KB por cookie, así
 * que vamos sobrados, pero por eso este adapter NO debe usarse para guardar
 * nada más ahí (solo lo que supabase-js le pida guardar).
 */
export const cookieStorage = {
  getItem: (key: string) => {
    return getCookie(key);
  },
  setItem: (key: string, value: string) => {
    setCookie(key, value);
  },
  removeItem: (key: string) => {
    removeCookie(key);
  },
};
