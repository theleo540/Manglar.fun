import { useEffect, useState } from "react";
import { FUTBOL_CONFIG } from "../config";
import type { EcosystemMatch } from "../../shared/types";

interface UseFutbolMatchesResult {
  domain: string;
  matches: EcosystemMatch[];
  checked: boolean;
}

/** Pide /api/widget/matches al backend de fútbol (WC2026Streams, Azure). */
export function useFutbolMatches(): UseFutbolMatchesResult {
  const [matches, setMatches] = useState<EcosystemMatch[]>([]);
  const [domain, setDomain] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`${FUTBOL_CONFIG.apiBaseUrl}/api/widget/matches`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json: { domain: string; matches: EcosystemMatch[] } | null) => {
        if (cancelled || !json) return;
        setDomain(json.domain);
        setMatches(json.matches || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { domain, matches, checked };
}
