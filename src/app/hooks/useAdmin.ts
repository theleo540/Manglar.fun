/**
 * useAdmin — punto único de entrada para todo lo relacionado a admin:
 * sesión (Supabase + GitHub OAuth), rol, permisos y directorio de admins.
 */
import { useAuth } from "@/hooks/useAuth";
import { useAdminsList } from "@/hooks/useAdminsList";
import { hasPermission, PERMISSIONS, type Permission } from "@/config/permissions";
import type { AdminRole } from "@/types/admin";

export function useAdmin() {
  const {
    user,
    role,
    isLoggedIn,
    isAdmin,
    isSuperAdmin,
    login,
    loginGoogle,
    loginWithEmailOtp,
    verifyEmailOtp,
    loginWithPassword,
    registerWithPassword,
    logout,
    loading,
  } = useAuth();
  const { admins } = useAdminsList();

  // userMode solo distingue permisos de admin — un "user" logueado
  // cuenta como "public" para efectos de permisos/dashboard.
  const userMode = role === "super-admin" ? ("super-admin" as const) : role === "admin" ? ("admin" as const) : ("public" as const);

  const isAdminRole = (r: typeof role): r is AdminRole => r === "admin" || r === "super-admin";
  const currentAdmin = user && isAdminRole(role) ? admins.find((a) => a.role === role) ?? null : null;

  function checkPermission(permission: Permission): boolean {
    return hasPermission(isAdminRole(role) ? role : null, permission);
  }

  return {
    user,
    login,
    loginGoogle,
    loginWithEmailOtp,
    verifyEmailOtp,
    loginWithPassword,
    registerWithPassword,
    logout,
    loading,
    userMode,
    isLoggedIn,
    isAdmin,
    isSuperAdmin,
    currentAdmin,
    admins,
    hasPermission: checkPermission,
    PERMISSIONS,
  };
}