import { useEffect, useState } from "react";
import { ecosystemActivityService } from "@/services/ecosystemActivityService";
import type { EcosystemActivity } from "@/types/activity";

export function useEcosystemActivity(ownerEmail: string | undefined) {
  const [activity, setActivity] = useState<EcosystemActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerEmail) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    ecosystemActivityService.getActivity(ownerEmail).then((data) => {
      if (!cancelled) {
        setActivity(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [ownerEmail]);

  return { activity, loading };
}
