export type UserMode = "public" | "super-admin" | "admin";
export type AdminTab = "overview" | "admins" | "users" | "services";

export type AdminRole = "super-admin" | "admin";
export type AdminStatus = "online" | "offline";

export interface Admin {
  id: string;
  username: string;
  role: AdminRole;
  avatar: string;
  version: string;
  lastAccess: string;
  status: AdminStatus;
}

export type ServiceStatus = "online" | "offline" | "maintenance";

export interface ServiceItem {
  id: string;
  project: string;
  status: ServiceStatus;
  uptime: string;
  version: string;
  lastDeploy: string;
}