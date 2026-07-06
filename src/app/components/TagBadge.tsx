export function TagBadge({ type, label }: { type?: string; label: string }) {
  const map: Record<string, string> = {
    live: "bg-red-600 text-white",
    new: "bg-[#0be881] text-black",
    trending: "bg-orange-500 text-white",
    hot: "bg-pink-600 text-white",
  };
  const cls = map[type ?? ""] ?? "bg-white/20 text-white";
  const isLive = type === "live";
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-sm ${cls} ${isLive ? "animate-pulse" : ""}`}>
      {isLive && <span className="w-1 h-1 rounded-full bg-white" />}
      {label}
    </span>
  );
}
