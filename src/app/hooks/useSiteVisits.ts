import { useState, useEffect } from "react";
import { analyticsService } from "@/services/analyticsService";

/**
 * Registra UNA visita al sitio por carga de página (se monta una sola vez,
 * dentro del Navbar, para que cuente sin importar en qué ruta se entre) y
 * mantiene el total real en estado para mostrarlo en el nav y en el
 * dashboard. No hay deduplicación por usuario/día a propósito.
 */
export function useSiteVisits() {
  const [siteVisits, setSiteVisits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    analyticsService.incrementSiteVisit().then((total) => {
      if (cancelled) return;
      if (total !== null) {
        setSiteVisits(total);
        setLoading(false);
      } else {
        analyticsService.getSiteVisits().then((v) => {
          if (!cancelled) {
            setSiteVisits(v);
            setLoading(false);
          }
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { siteVisits, loading };
}
