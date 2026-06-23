import { cn } from '@/lib/cn';

type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slateblue">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-500">{error}</span> : null}
    </label>
  );
}

export function inputClassName(hasError?: boolean) {
  return cn(
    'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10',
    hasError ? 'border-rose-300' : 'border-slate-200',
  );
}
