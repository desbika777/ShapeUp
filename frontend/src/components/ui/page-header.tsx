import { cn } from '@/lib/cn';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-panel backdrop-blur md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">{eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-slateblue">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p>
      </div>
      {action ? <div className={cn('flex items-center')}>{action}</div> : null}
    </div>
  );
}
