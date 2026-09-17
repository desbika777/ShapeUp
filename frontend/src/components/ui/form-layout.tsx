import type { LucideIcon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

type FormCardProps = {
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

type GuidanceCardProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
};

type FormActionsProps = {
  backTo?: string;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel?: string;
};

export function FormCard({ children, onSubmit }: FormCardProps) {
  return (
    <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6" onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export function GuidanceCard({ description, eyebrow, icon: Icon, items, title }: GuidanceCardProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal/10 text-teal">
        <Icon size={22} />
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">{eyebrow}</p>
      <h2 className="mt-2 font-display text-xl font-semibold text-slateblue">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-5 text-slate-600">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function FormActions({ backTo, isSubmitting, submitLabel, submittingLabel = 'Salvando...' }: FormActionsProps) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
      {backTo ? (
        <Link to={backTo} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-teal/50 hover:text-teal">
          <ArrowLeft size={16} />
          Voltar
        </Link>
      ) : <span />}
      <button disabled={isSubmitting} className={cn('inline-flex items-center justify-center rounded-md bg-slateblue px-5 py-3 text-sm font-semibold text-white transition hover:bg-slateblue/90 disabled:cursor-not-allowed disabled:opacity-60', 'focus:outline-none focus:ring-4 focus:ring-slateblue/20')}>
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </div>
  );
}
