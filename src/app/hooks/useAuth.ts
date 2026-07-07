import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AUTHORIZED_ADMINS } from "@/config/auth";

export interface AuthUser {
  name: string;
  email: string;
  avatar: string;
  role: "super-admin" | "admin" | "user";
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
  return {
    name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.user_name ?? email,
    email,
    avatar: session.user.user_metadata?.avatar_url ?? "",
    role,
  };
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

    return () => subscription.unsubscribe();
  }, []);

  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
        scopes: "read:user user:email",
      },
    });
  }

  /**
   * Login con Google. Requiere habilitar el provider "Google" en
   * Supabase → Authentication → Providers (Client ID/Secret de Google
   * Cloud Console), igual que GitHub. Sin eso, Supabase devuelve un
   * error y no se abre el popup — no es un bug de este código.
   */
  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
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
    logout,
    loading,
  };
}
