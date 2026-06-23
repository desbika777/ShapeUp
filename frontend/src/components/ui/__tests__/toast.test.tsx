import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '@/components/ui/toast';

function Demo() {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast({ variant: 'success', title: 'Ok', message: 'Salvo' })}>
      Trigger
    </button>
  );
}

describe('ToastProvider', () => {
  it('shows and auto-dismisses toasts', async () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger'));
    expect(screen.getByText('Ok')).toBeInTheDocument();
    expect(screen.getByText('Salvo')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.queryByText('Ok')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
