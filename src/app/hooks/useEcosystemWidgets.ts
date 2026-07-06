import { useEffect, useState } from "react";
import { ECOSYSTEM_PROJECTS } from "../config/ecosystem";
import type { EcosystemWidgetResponse } from "../types/ecosystem";

/**
 * Pide el /api/widget de TODOS los proyectos del registry en paralelo.
 * Los que no responden (no existen todavía, DNS no listo, etc) se
 * descartan solos — nunca se pinta una tarjeta de un proyecto fantasma.
 */
export function useEcosystemWidgets() {
  const [projects, setProjects] = useState<EcosystemWidgetResponse[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      ECOSYSTEM_PROJECTS.map((p) =>
        fetch(p.widgetUrl)
          .then((r) => (r.ok ? (r.json() as Promise<EcosystemWidgetResponse>) : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setProjects(results.filter((r): r is EcosystemWidgetResponse => r !== null));
      setChecked(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, checked };
}
