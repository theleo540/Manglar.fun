import type { ServiceStatus } from "@/types/admin";
import { cn } from "@/components/ui/utils";

const SVC_CFG: Record<ServiceStatus, { text: string; dot: string; label: string }> = {
  online: { text: "text-emerald-400", dot: "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]", label: "Online" },
  offline: { text: "text-red-400", dot: "bg-red-400 shadow-[0_0_6px_rgba(248,81,73,0.6)]", label: "Offline" },
  maintenance: { text: "text-amber-400", dot: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]", label: "Mantenimiento" },
};

interface Props {
  status: ServiceStatus;
}

export function SvcDot({ status }: Props) {
  const c = SVC_CFG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", c.text)}>
      <span className={cn("w-2 h-2 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}
