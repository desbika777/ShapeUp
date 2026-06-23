type MetricCardProps = {
  label: string;
  value: string;
  trend: string;
};

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-4 font-display text-3xl font-semibold text-slateblue">{value}</p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-teal">{trend}</p>
    </div>
  );
}
