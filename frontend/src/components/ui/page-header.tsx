// Cabecalho padrao das paginas internas, com texto e acao opcional.
import { cn } from '@/lib/cn';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">{eyebrow}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-slateblue">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action ? <div className={cn('flex shrink-0 items-center')}>{action}</div> : null}
    </div>
  );
}
