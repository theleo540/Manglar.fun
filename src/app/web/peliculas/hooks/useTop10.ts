import { useEffect, useState } from "react";
import { PELICULAS_CONFIG } from "../config";
import type { EcosystemMovieItem } from "../../shared/types";

interface UsePeliculasTop10Result {
  domain: string;
  top10: EcosystemMovieItem[];
  trending: EcosystemMovieItem[];
  checked: boolean;
}

/** Pide /api/widget/top10 al backend de ManglarPelis (top 10 + tendencias). */
export function usePeliculasTop10(): UsePeliculasTop10Result {
  const [domain, setDomain] = useState("");
  const [top10, setTop10] = useState<EcosystemMovieItem[]>([]);
  const [trending, setTrending] = useState<EcosystemMovieItem[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`${PELICULAS_CONFIG.apiBaseUrl}/api/widget/top10`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json: { domain: string; top10: EcosystemMovieItem[]; trending: EcosystemMovieItem[] } | null) => {
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
  }, []);

  return { domain, top10, trending, checked };
}
