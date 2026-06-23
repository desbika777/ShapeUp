type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-panel">
      <h3 className="font-display text-2xl font-semibold text-slateblue">{title}</h3>
      <p className="mt-3 text-sm text-slate-500">{description}</p>
    </div>
  );
}
