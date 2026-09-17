// Card de metrica usado no dashboard para numeros principais.
type MetricCardProps = {
  label: string;
  value: string;
  trend: string;
};

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 font-display text-2xl font-semibold text-slateblue">{value}</p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-teal">{trend}</p>
    </div>
  );
}
