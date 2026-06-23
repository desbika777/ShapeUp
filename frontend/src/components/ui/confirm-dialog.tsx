import { AlertTriangle } from 'lucide-react';

type ConfirmDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
};

export function ConfirmDialog({ title, description, onConfirm }: ConfirmDialogProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <AlertTriangle size={18} />
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
      <button onClick={onConfirm} className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Confirmar</button>
    </div>
  );
}
