import { useEffect, useState } from "react";
import { PELICULAS_CONFIG } from "../config";
import type { EcosystemWidgetResponse } from "../../shared/types";

interface UsePeliculasWidgetResult {
  data: EcosystemWidgetResponse | null;
  loading: boolean;
  error: boolean;
}

/** Pide /api/widget al backend de ManglarPelis. */
export function usePeliculasWidget(): UsePeliculasWidgetResult {
  const [data, setData] = useState<EcosystemWidgetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`${PELICULAS_CONFIG.apiBaseUrl}/api/widget`)
      .then((r) => {
        if (!r.ok) throw new Error(`widget respondió ${r.status}`);
        return r.json();
      })
      .then((json: EcosystemWidgetResponse) => {
        if (cancelled) return;
        setData(json);
        setError(false);
      })
      .catch(() => {
        if (cancelled) return;
        setData(null);
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
