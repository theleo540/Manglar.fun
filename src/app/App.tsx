import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Dashboard } from "./pages/Dashboard";
import { PageShell } from "./components/PageShell";
import { useAdmin } from "./hooks/useAdmin";
import { ROUTES, type AppRoute } from "./config/routes";

/** Mapa entre rutas internas (AppRoute) y URLs reales del navegador. */
const ROUTE_PATHS: Record<AppRoute, string> = {
  [ROUTES.HOME]: "/",
  [ROUTES.PROFILE]: "/profile",
  [ROUTES.DASHBOARD]: "/dashboard",
};

const PATH_ROUTES: Record<string, AppRoute> = Object.fromEntries(
  Object.entries(ROUTE_PATHS).map(([route, path]) => [path, route as AppRoute])
);

/** Lee la pestaña actual desde la URL real (ej. /dashboard) al cargar/refrescar. */
function getPageFromUrl(): AppRoute {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return PATH_ROUTES[path] ?? ROUTES.HOME;
}

export default function App() {
  const [page, setPage] = useState<AppRoute>(getPageFromUrl);
  const { isAdmin, userMode, loading } = useAdmin();

  function navigate(route: AppRoute) {
    setPage(route);
    window.history.pushState({}, "", ROUTE_PATHS[route]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Soporta los botones "atrás"/"adelante" del navegador
  useEffect(() => {
    function onPopState() {
      setPage(getPageFromUrl());
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Si el usuario pierde acceso admin, vuelve al inicio. Espera a que
  // `loading` termine para no expulsar a un admin real antes de tiempo.
  useEffect(() => {
    if (!loading && !isAdmin && page === ROUTES.DASHBOARD) navigate(ROUTES.HOME);
  }, [isAdmin, loading, page]);

  return (
    <>
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "#161B22",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#E6EDF3",
          },
        }}
      />

      {page === ROUTES.HOME && <Home navigate={navigate} />}
      {page === ROUTES.PROFILE && (
        <PageShell navigate={navigate}>
          <Profile />
        </PageShell>
      )}
      {page === ROUTES.DASHBOARD && isAdmin && (
        <PageShell navigate={navigate}>
          <Dashboard userMode={userMode} />
        </PageShell>
      )}
    </>
  );
}
