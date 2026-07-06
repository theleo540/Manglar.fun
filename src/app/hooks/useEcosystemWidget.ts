import { useEffect, useState } from "react";
import { ECOSYSTEM_PROJECTS } from "../config/ecosystem";
import type { EcosystemWidgetResponse } from "../types/ecosystem";

interface UseEcosystemWidgetResult {
  data: EcosystemWidgetResponse | null;
  loading: boolean;
  /** true si el fetch falló o el proyecto no responde (aún no existe, DNS no listo, etc). */
  error: boolean;
}

/**
 * Pide el /api/widget de UN proyecto del ecosistema por su slug (ver
 * config/ecosystem.ts). Se usa tanto en el Hero como en cualquier
 * <WidgetX /> individual.
 *
 * Uso: const { data } = useEcosystemWidget("wc2026streams");
 */
export function useEcosystemWidget(slug: string): UseEcosystemWidgetResult {
  const [data, setData] = useState<EcosystemWidgetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const project = ECOSYSTEM_PROJECTS.find((p) => p.slug === slug);
    if (!project) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(project.widgetUrl)
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
  }, [slug]);

  return { data, loading, error };
}
