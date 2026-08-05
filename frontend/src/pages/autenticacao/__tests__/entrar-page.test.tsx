// Testes da tela de login: validam comportamento basico do formulario.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/context/auth-context';
import { EntrarPage } from '@/pages/autenticacao/entrar-page';

function renderEntrarPage() {
  // Renderiza a pagina com os provedores necessarios para o teste.
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <EntrarPage />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('EntrarPage', () => {
  it('exibe opcao para lembrar o acesso marcada por padrao', () => {
    renderEntrarPage();

    expect(screen.getByRole('checkbox', { name: 'Lembrar meu acesso' })).toBeChecked();
  });

  it('valida campos obrigatorios e email invalido', async () => {
    const user = userEvent.setup();
    renderEntrarPage();

    await user.type(screen.getByLabelText('E-mail'), 'email-invalido');
    await user.click(screen.getByRole('button', { name: 'Entrar agora' }));

    expect(await screen.findByText('Informe um e-mail valido.')).toBeInTheDocument();
    expect(await screen.findByText('Informe sua senha.')).toBeInTheDocument();
  });
});
