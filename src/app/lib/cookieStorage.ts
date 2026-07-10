/**
 * Storage adapter para Supabase Auth que usa cookies en vez de localStorage,
 * con Domain=.manglar.fun para que la sesión viaje entre TODOS los
 * subdominios (manglar.fun, wc2026streams.manglar.fun, manglarpelis.manglar.fun, etc).
 *
 * localStorage es por-origin (cada subdominio tiene el suyo), por eso no
 * sirve para SSO entre subdominios. Cookies con Domain=.manglar.fun sí,
 * porque el navegador las manda automáticamente a cualquier *.manglar.fun.
 *
 * IMPORTANTE: este archivo debe ser IDÉNTICO en todos los repos
 * (Manglar, WC2026, ManglarPelis, y los que vengan) — mismo cookie name,
 * mismo Domain. Si lo cambias en uno, cámbialo en todos o se rompe el SSO.
 *
 * ── Por qué está partido en chunks ──────────────────────────────────────
 * La sesión completa de Supabase (access_token + refresh_token + objeto
 * `user` con `identities`, sobre todo en login con Google/GitHub) pesa
 * bastante más de lo que parece — fácil 1.5-3KB en crudo. Codificado con
 * encodeURIComponent (que escapa CADA `{`, `"`, `:`, `,` del JSON) ese
 * tamaño casi se triplica, así que terminaba pasando el límite de ~4096
 * bytes que soporta una sola cookie. Cuando eso pasa, el navegador
 * descarta la cookie EN SILENCIO (sin ningún error) — por eso el login
 * parecía funcionar pero se perdía la sesión hasta con solo refrescar,
 * en el mismo sitio, sin necesidad de cruzar dominios.
 *
 * Dos cambios para resolverlo:
 * 1. Codificamos en base64 en vez de encodeURIComponent — mucho más
 *    compacto para JSON lleno de puntuación (~1.37x el tamaño original,
 *    vs hasta ~3x con encodeURIComponent).
 * 2. Si aun así no entra en una sola cookie, lo partimos en varias
 *    (`${name}.0`, `${name}.1`, ...) — mismo enfoque que usa el paquete
 *    oficial @supabase/ssr para este mismo problema.
 */

const COOKIE_DOMAIN = ".manglar.fun";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 año (Supabase igual refresca el token solo)

// Tamaño máximo de VALOR por cookie individual. Dejamos margen bajo el
// límite real (~4093 bytes totales por cookie, nombre+valor+atributos
// incluidos) para el nombre (con sufijo ".N") y los atributos
// (Domain=.manglar.fun; Path=/; Max-Age=...; SameSite=Lax; Secure).
const CHUNK_SIZE = 3200;

// En local (localhost, *.netlify.app de preview, etc.) Domain=.manglar.fun
// no aplica y el navegador rechazaría/ignoraría la cookie con ese dominio.
// Detectamos eso y en ese caso no forzamos el Domain, para que dev/previews
// sigan funcionando (con cookie normal, sin compartir entre subdominios).
function isManglarDomain(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.endsWith("manglar.fun");
}

// base64 "seguro para cookies" (sin caracteres que rompan el header
// Set-Cookie como ';' o ','; base64 estándar ya evita eso, pero por las
// dudas usamos btoa/atob directo ya que el alfabeto base64 no incluye
// ninguno de los caracteres problemáticos de todos modos).
function encodeValue(value: string): string {
  // encodeURIComponent + unescape antes de btoa: soporta cualquier
  // caracter Unicode (nombres/avatares con acentos, emoji, etc.), no
  // solo Latin1 plano.
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeValue(encoded: string): string {
  return decodeURIComponent(escape(atob(encoded)));
}

function getAllCookies(): Record<string, string> {
  if (typeof document === "undefined") return {};
  const out: Record<string, string> = {};
  for (const pair of document.cookie.split("; ")) {
    if (!pair) continue;
    const idx = pair.indexOf("=");
    if (idx === -1) continue;
    out[pair.slice(0, idx)] = pair.slice(idx + 1);
  }
  return out;
}

function writeRawCookie(name: string, rawValue: string, maxAgeSeconds: number) {
  const domainPart = isManglarDomain() ? `; Domain=${COOKIE_DOMAIN}` : "";
  const securePart = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${name}=${rawValue}; Path=/; Max-Age=${maxAgeSeconds}` +
    `${domainPart}; SameSite=Lax${securePart}`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const all = getAllCookies();

  // Caso simple: cookie sin partir.
  if (name in all) {
    try {
      return decodeValue(all[name]);
    } catch {
      return null;
    }
  }

  // Caso partido en chunks: `${name}.0`, `${name}.1`, ... hasta que falte uno.
  const chunks: string[] = [];
  let i = 0;
  while (`${name}.${i}` in all) {
    chunks.push(all[`${name}.${i}`]);
    i++;
  }
  if (chunks.length === 0) return null;

  try {
    return decodeValue(chunks.join(""));
  } catch {
    return null;
  }
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;

  // Por si había una versión previa guardada de otra forma (ej. venía de
  // sin-chunks y ahora necesita chunks, o al revés), limpiamos todo antes
  // de escribir la versión nueva.
  removeCookie(name);

  const encoded = encodeValue(value);

  if (encoded.length <= CHUNK_SIZE) {
    writeRawCookie(name, encoded, MAX_AGE_SECONDS);
    return;
  }

  for (let i = 0, offset = 0; offset < encoded.length; i++, offset += CHUNK_SIZE) {
    const part = encoded.slice(offset, offset + CHUNK_SIZE);
    writeRawCookie(`${name}.${i}`, part, MAX_AGE_SECONDS);
  }
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  const domainPart = isManglarDomain() ? `; Domain=${COOKIE_DOMAIN}` : "";

  // Borra la versión sin chunks (si existe).
  document.cookie = `${name}=; Path=/; Max-Age=0${domainPart}; SameSite=Lax`;

  // Borra cualquier chunk que pueda existir (hasta 20 — de sobra para
  // cualquier tamaño de sesión razonable).
  for (let i = 0; i < 20; i++) {
    document.cookie = `${name}.${i}=; Path=/; Max-Age=0${domainPart}; SameSite=Lax`;
  }
}

/**
 * Cumple la interfaz `Storage`-like que pide `auth.storage` de supabase-js
 * (getItem/setItem/removeItem, todos síncronos u opcionalmente async).
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