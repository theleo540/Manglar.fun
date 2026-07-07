import { useState, useEffect, useCallback } from "react";
import type { Profile } from "@/types/profile";
import { profileService } from "@/services/profileService";

export function useProfile() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    profileService.getProfiles().then((list) => {
      if (cancelled) return;
      setProfiles(list);
      setSelectedId((prev) => prev ?? list[0]?.id ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const profile = profiles.find((p) => p.id === selectedId) ?? profiles[0] ?? null;

  const save = useCallback(async (ownerEmail: string, updates: Partial<Profile>) => {
    setSaving(true);
    try {
      const updated = await profileService.updateProfile(ownerEmail, updates);
      setProfiles((prev) => prev.map((p) => (p.ownerEmail === ownerEmail ? updated : p)));
      return updated;
    } finally {
      setSaving(false);
    }
  }, []);

  return { profiles, profile, selectedId, setSelectedId, loading, saving, save };
}
