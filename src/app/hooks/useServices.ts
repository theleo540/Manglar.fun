import { useState, useEffect } from "react";
import type { ServiceItem } from "@/types/admin";
import { serviceService } from "@/services/serviceService";

export function useServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    serviceService.getServices().then((list) => {
      if (cancelled) return;
      setServices(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(service: ServiceItem): Promise<"created" | "updated"> {
    const isNew = !services.some((s) => s.id === service.id) || !service.id;
    if (isNew) {
      const { id: _ignoredId, ...rest } = service;
      const created = await serviceService.createService(rest);
      setServices((prev) => [created, ...prev]);
      return "created";
    }
    const updated = await serviceService.updateService(service);
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    return "updated";
  }

  async function remove(id: string): Promise<void> {
    await serviceService.deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  return { services, loading, save, remove };
}
