import type { ServiceItem, ServiceStatus } from "@/types/admin";
import { FALLBACK_SERVICES } from "@/data/admins";
import { supabase } from "@/lib/supabase";

export const EMPTY_SERVICE: Omit<ServiceItem, "id"> = {
  project: "",
  status: "online" as ServiceStatus,
  uptime: "100%",
  version: "1.0.0",
  lastDeploy: new Date().toISOString().slice(0, 10),
};

function fromRow(row: Record<string, unknown>): ServiceItem {
  return {
    id: row.id as string,
    project: (row.project as string) ?? "",
    status: (row.status as ServiceStatus) ?? "online",
    uptime: (row.uptime as string) ?? "0%",
    version: (row.version as string) ?? "1.0.0",
    lastDeploy: (row.last_deploy as string) ?? "",
  };
}

function toRow(s: Partial<ServiceItem>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (s.project !== undefined) row.project = s.project;
  if (s.status !== undefined) row.status = s.status;
  if (s.uptime !== undefined) row.uptime = s.uptime;
  if (s.version !== undefined) row.version = s.version;
  if (s.lastDeploy !== undefined) row.last_deploy = s.lastDeploy;
  return row;
}

export const serviceService = {
  async getServices(): Promise<ServiceItem[]> {
    const { data, error } = await supabase.from("services").select("*").order("project", { ascending: true });
    if (error || !data) {
      if (error) console.warn("[serviceService] usando datos de respaldo:", error.message);
      return [...FALLBACK_SERVICES];
    }
    return data.map(fromRow);
  },

  async createService(data: Omit<ServiceItem, "id">): Promise<ServiceItem> {
    const { data: row, error } = await supabase.from("services").insert(toRow(data)).select().single();
    if (error || !row) throw new Error(error?.message ?? "No se pudo crear el servicio");
    return fromRow(row);
  },

  async updateService(updated: ServiceItem): Promise<ServiceItem> {
    const { data: row, error } = await supabase.from("services").update(toRow(updated)).eq("id", updated.id).select().single();
    if (error || !row) throw new Error(error?.message ?? "No se pudo actualizar el servicio");
    return fromRow(row);
  },

  async deleteService(id: string): Promise<void> {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw new Error(error.message ?? "No se pudo eliminar el servicio");
  },

  getEmptyService(): Omit<ServiceItem, "id"> {
    return { ...EMPTY_SERVICE };
  },
};
