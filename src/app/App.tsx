import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { PageShell } from "./components/PageShell";
import { useAdmin } from "./hooks/useAdmin";
import { useSiteVisits } from "./hooks/useSiteVisits";
import { ROUTES, type AppRoute } from "./config/routes";

/** Mapa entre rutas internas (AppRoute) y URLs reales del navegador. */
const ROUTE_PATHS: Record<AppRoute, string> = {
  [ROUTES.HOME]: "/",
  [ROUTES.PROFILE]: "/profile",
  [ROUTES.DASHBOARD]: "/dashboard",
  [ROUTES.NOT_FOUND]: "/404",
};

const PATH_ROUTES: Record<string, AppRoute> = Object.fromEntries(
  Object.entries(ROUTE_PATHS).map(([route, path]) => [path, route as AppRoute])
);

/** Lee la pestaña actual desde la URL real (ej. /dashboard) al cargar/refrescar. */
function getPageFromUrl(): AppRoute {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  // Antes cualquier ruta desconocida caía silenciosamente en Home. Ahora
  // cae en la página 404 real, para que quede claro que esa URL no existe
  // (en vez de aparentar que sí existe y mostrar el inicio).
  return PATH_ROUTES[path] ?? ROUTES.NOT_FOUND;
}

export default function App() {
  const [page, setPage] = useState<AppRoute>(getPageFromUrl);
  const { isAdmin, userMode, loading } = useAdmin();
  // Se registra UNA sola vez por carga de la app (no una vez por página),
  // para que el contador de "Visitas totales" sea real y no se infle al
  // navegar entre Inicio/Perfil/Dashboard.
  const { siteVisits } = useSiteVisits();

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

      {page === ROUTES.HOME && <Home navigate={navigate} siteVisits={siteVisits} />}
      {page === ROUTES.PROFILE && (
        <PageShell navigate={navigate} siteVisits={siteVisits}>
          <Profile />
        </PageShell>
      )}
      {page === ROUTES.DASHBOARD && isAdmin && (
        <PageShell navigate={navigate} siteVisits={siteVisits}>
          <Dashboard userMode={userMode} siteVisits={siteVisits} />
        </PageShell>
      )}

      {page === ROUTES.NOT_FOUND && (
        <PageShell navigate={navigate} siteVisits={siteVisits}>
          <NotFound navigate={navigate} />
        </PageShell>
      )}
    </>
  );
}