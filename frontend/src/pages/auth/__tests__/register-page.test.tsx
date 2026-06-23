import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/context/auth-context';
import { RegisterPage } from '@/pages/auth/register-page';

function renderRegisterPage() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <RegisterPage />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('RegisterPage', () => {
  it('valida confirmacao de senha', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText('Nome completo'), 'ShapeUp Admin');
    await user.type(screen.getByLabelText('E-mail'), 'admin@shapeup.com');
    await user.type(screen.getByLabelText('CPF'), '11144477735');
    await user.type(screen.getByLabelText('Senha'), 'ShapeUp@123');
    await user.type(screen.getByLabelText('Confirmar senha'), 'ShapeUp@999');
    await user.click(screen.getByRole('button', { name: 'Cadastrar e entrar' }));

    expect(await screen.findByText('A confirmacao da senha nao confere.')).toBeInTheDocument();
  });
});
