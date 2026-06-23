import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

type ToastVariant = 'success' | 'error' | 'info';

type ToastItem = {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (input: { title?: string; message: string; variant?: ToastVariant }) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function toastTone(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    case 'error':
      return 'border-rose-200 bg-rose-50 text-rose-900';
    case 'info':
    default:
      return 'border-slate-200 bg-white text-slateblue';
  }
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timeouts = useRef(new Map<string, number>());

  const remove = useCallback((id: string) => {
    const timeout = timeouts.current.get(id);
    if (timeout) {
      window.clearTimeout(timeout);
      timeouts.current.delete(id);
    }

    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((input: { title?: string; message: string; variant?: ToastVariant }) => {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    const variant = input.variant ?? 'info';

    setItems((current) => [{ id, title: input.title, message: input.message, variant }, ...current].slice(0, 3));

    const ttl = variant === 'error' ? 6500 : 3800;
    const timeout = window.setTimeout(() => remove(id), ttl);
    timeouts.current.set(id, timeout);
  }, [remove]);

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 space-y-3 lg:inset-x-auto lg:right-6 lg:top-6 lg:bottom-auto lg:w-[380px]">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'pointer-events-auto rounded-3xl border p-4 shadow-panel backdrop-blur',
              'animate-fade-up',
              toastTone(item.variant),
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {item.title ? <p className="font-semibold">{item.title}</p> : null}
                <p className={cn('text-sm', item.title ? 'mt-1' : undefined)}>{item.message}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded-full p-2 text-current/70 hover:bg-black/5"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return value;
}
