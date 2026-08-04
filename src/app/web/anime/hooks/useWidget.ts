import { useEffect, useState } from "react";
import type { AnimeVerticalConfig } from "../config";
import type { EcosystemWidgetResponse } from "../../shared/types";

interface UseAnimeWidgetResult {
  data: EcosystemWidgetResponse | null;
  loading: boolean;
  error: boolean;
}

/**
 * Pide /api/widget al backend de anime1v-api. Recibe el config como
 * parámetro (a diferencia de useFutbolWidget/usePeliculasWidget, que son
 * un vertical fijo) porque este mismo hook sirve tanto para
 * ANIME_CONFIG como para HENTAI_CONFIG — es el mismo backend, dos
 * deploys.
 */
export function useAnimeWidget(config: AnimeVerticalConfig): UseAnimeWidgetResult {
  const [data, setData] = useState<EcosystemWidgetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`${config.apiBaseUrl}/api/widget`)
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
  }, [config.apiBaseUrl]);

  return { data, loading, error };
}
