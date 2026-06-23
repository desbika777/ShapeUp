type TableSkeletonProps = {
  columns?: number;
  rows?: number;
};

export function TableSkeleton({ columns = 6, rows = 6 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-panel">
      <div className="animate-pulse">
        <div className="grid gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-3 rounded-full bg-slate-200/70" />
          ))}
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid gap-3 px-6 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
              {Array.from({ length: columns }).map((__, colIndex) => (
                <div key={colIndex} className="h-3 rounded-full bg-slate-100" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

