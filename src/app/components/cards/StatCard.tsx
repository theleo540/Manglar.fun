interface Props {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}

export function StatCard({ icon, label, value, sub }: Props) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-white/[0.08] bg-[#161B22]">
      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-white font-mono">{value}</p>
        {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
