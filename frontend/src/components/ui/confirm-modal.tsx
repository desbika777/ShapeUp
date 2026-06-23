import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/cn';

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'default',
  isLoading,
  onConfirm,
}: ConfirmModalProps) {
  const confirmClass = tone === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slateblue hover:bg-slateblue/90';
  const iconClass = tone === 'danger' ? 'text-rose-600' : 'text-teal';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2',
            'rounded-[28px] border border-white/60 bg-white p-6 shadow-panel',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn('mt-0.5 rounded-2xl bg-slate-50 p-3', iconClass)}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <Dialog.Title className="font-display text-2xl font-semibold text-slateblue">{title}</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-slate-500">{description}</Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Fechar">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={Boolean(isLoading)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slateblue disabled:opacity-60"
              >
                {cancelLabel}
              </button>
            </Dialog.Close>
            <button
              type="button"
              disabled={Boolean(isLoading)}
              onClick={() => void onConfirm()}
              className={cn('rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-60', confirmClass)}
            >
              {isLoading ? 'Processando...' : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

