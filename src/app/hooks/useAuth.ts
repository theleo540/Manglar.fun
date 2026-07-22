import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AUTHORIZED_ADMINS } from "@/config/auth";
import { openOAuthPopup, waitForPopupClose } from "@/lib/oauthPopup";

export interface AuthUser {
  name: string;
  email: string;
  avatar: string;
  role: "super-admin" | "admin" | "user";
  provider: string;
}

/**
 * Cualquier cuenta de GitHub que inicie sesión obtiene un AuthUser real
 * (multi-login: usuarios normales y admins comparten el mismo botón de
 * login). El rol "admin"/"super-admin" solo se otorga si el email está
 * en AUTHORIZED_ADMINS; si no, queda como "user" (modo normal, sin
 * acceso a /dashboard ni a las acciones de admin).
 */
function resolveUserFromSession(session: Session | null): AuthUser | null {
  if (!session?.user) return null;
  const email = (session.user.email ?? "").toLowerCase();
  const role = AUTHORIZED_ADMINS[email] ?? "user";
  // Supabase mete el método de login real en app_metadata.provider
  // ("github", "google" o "email" si entró con OTP/password).
  const provider = session.user.app_metadata?.provider ?? "email";
  return {
    name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.user_name ?? email,
    email,
    avatar: session.user.user_metadata?.avatar_url ?? "",
    role,
    provider,
  };
}

// La app Android (MainActivity.kt) carga tanto wc2026streams.manglar.fun
// como manglar.fun dentro del mismo WebView -- si el usuario hace login
// de Google desde una página de manglar.fun dentro de la app, es el
// mismo caso: Google se abre en Chrome y esa sesión nunca vuelve sola al
// WebView. `AndroidApp` es el puente que la app inyecta vía
// addJavascriptInterface -- si existe, estamos dentro del WebView nativo.
function isNativeApp(): boolean {
  return typeof window !== "undefined" && !!(window as any).AndroidApp?.isNativeApp?.();
}

const NATIVE_AUTH_REDIRECT = "wc2026manglar://auth-callback";

declare global {
  interface Window {
    __mangloDeepLinkSession?: { access_token: string; refresh_token: string };
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Escuchar cambios en tiempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(resolveUserFromSession(session));
      setLoading(false);
    });

    // ★ Mismo puente que usa wc2026: cuando el login de Google se hizo
    // desde dentro de la app Android, MainActivity.kt intercepta el
    // deep link wc2026manglar://auth-callback y deja el token en
    // window.__mangloDeepLinkSession, disparando este evento.
    function onDeepLinkSession() {
      const pending = window.__mangloDeepLinkSession;
      if (!pending?.access_token) return;
      window.__mangloDeepLinkSession = undefined;
      supabase.auth
        .setSession({ access_token: pending.access_token, refresh_token: pending.refresh_token })
        .catch(() => {});
    }
    window.addEventListener("manglo-deep-link-session", onDeepLinkSession);
    onDeepLinkSession();

    // 2. Si venimos de un redirect OAuth, el token está en el hash — procesarlo
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(resolveUserFromSession(session));
        setLoading(false);
        window.history.replaceState(null, "", window.location.pathname);
      });
    } else {
      // 3. Sesión normal (ya estaba logueado antes)
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(resolveUserFromSession(session));
        setLoading(false);
      });
    }

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("manglo-deep-link-session", onDeepLinkSession);
    };
  }, []);

  async function login() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/?authPopup=1`,
        scopes: "read:user user:email",
        skipBrowserRedirect: true,
      },
    });
    if (error || !data?.url) return;
    openInPopupOrRedirect(data.url, "github-login");
  }

  /**
   * Login con Google. Requiere habilitar el provider "Google" en
   * Supabase → Authentication → Providers (Client ID/Secret de Google
   * Cloud Console), igual que GitHub. Sin eso, Supabase devuelve un
   * error y no se abre el popup — no es un bug de este código.
   */
  async function loginGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: isNativeApp() ? NATIVE_AUTH_REDIRECT : `${window.location.origin}/?authPopup=1`,
        skipBrowserRedirect: true,
      },
    });
    if (error || !data?.url) return;
    openInPopupOrRedirect(data.url, "google-login");
  }

  // Login en ventana pequeña centrada (no navega la página/iframe actual,
  // relevante ahora que Hub también se embebe dentro de Laduela).
  function openInPopupOrRedirect(url: string, name: string) {
    const popup = openOAuthPopup(url, name);
    if (!popup) {
      window.location.href = url;
      return;
    }
    waitForPopupClose(popup, () => {
      supabase.auth.getSession();
    });
  }

  /**
   * Paso 1 del login por correo: envía un código de 6 dígitos al email.
   * shouldCreateUser en true permite que sirva tanto para login como
   * para registro — si el email no existe, Supabase crea la cuenta.
   */
  async function loginWithEmailOtp(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  }

  /**
   * Paso 2: verifica el código que el usuario recibió por correo.
   * Si es correcto, Supabase crea la sesión y onAuthStateChange
   * dispara solo (ver el useEffect de arriba).
   */
  async function verifyEmailOtp(email: string, token: string) {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) throw error;
  }

  /**
   * Login con email + contraseña (alternativa al código de un solo uso).
   */
  async function loginWithPassword(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  /**
   * Registro con email + contraseña. Por defecto Supabase exige
   * confirmar el correo (revisa Authentication → Settings → "Confirm
   * email") antes de dejar iniciar sesión; si lo desactivas ahí, la
   * sesión queda activa de inmediato tras registrarse.
   */
  async function registerWithPassword(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return {
    user,
    role: user?.role ?? null,
    isLoggedIn: user !== null,
    isAdmin: user?.role === "admin" || user?.role === "super-admin",
    isSuperAdmin: user?.role === "super-admin",
    login,
    loginGoogle,
    loginWithEmailOtp,
    verifyEmailOtp,
    loginWithPassword,
    registerWithPassword,
    logout,
    loading,
  };
}