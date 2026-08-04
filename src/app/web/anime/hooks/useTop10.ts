import { useEffect, useState } from "react";
import type { AnimeVerticalConfig } from "../config";
import type { EcosystemAnimeItem } from "../../shared/types";

interface UseAnimeTop10Result {
  domain: string;
  top10: EcosystemAnimeItem[];
  trending: EcosystemAnimeItem[];
  checked: boolean;
}

/**
 * Pide /api/widget/top10 al backend de anime1v-api (top 10 + tendencias
 * reales, scrapeadas del proveedor configurado ahí por WIDGET_PROVIDER).
 * Mismo criterio que usePeliculasTop10: si el backend no responde, listas
 * vacías — nunca datos inventados.
 */
export function useAnimeTop10(config: AnimeVerticalConfig): UseAnimeTop10Result {
  const [domain, setDomain] = useState("");
  const [top10, setTop10] = useState<EcosystemAnimeItem[]>([]);
  const [trending, setTrending] = useState<EcosystemAnimeItem[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setChecked(false);

    fetch(`${config.apiBaseUrl}/api/widget/top10`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json: { domain: string; top10: EcosystemAnimeItem[]; trending: EcosystemAnimeItem[] } | null) => {
        if (cancelled || !json) return;
        setDomain(json.domain);
        setTop10(json.top10 || []);
        setTrending(json.trending || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [config.apiBaseUrl]);

  return { domain, top10, trending, checked };
}
