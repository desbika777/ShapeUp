// Testes da tela de cadastro: garantem validacao de senha e formulario.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/context/auth-context';
import { CadastroPage } from '@/pages/autenticacao/cadastro-page';

function renderCadastroPage() {
  // Monta a pagina com roteador, autenticacao, toast e cache de dados.
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <CadastroPage />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CadastroPage', () => {
  it('valida confirmacao de senha', async () => {
    const user = userEvent.setup();
    renderCadastroPage();

    await user.type(screen.getByLabelText('Nome completo'), 'Administrador Shape');
    await user.type(screen.getByLabelText('E-mail'), 'admin@shape.com.br');
    await user.type(screen.getByLabelText('CPF'), '11144477735');
    await user.type(screen.getByLabelText('Senha'), 'Shape@123');
    await user.type(screen.getByLabelText('Confirmar senha'), 'Shape@999');
    await user.click(screen.getByRole('button', { name: 'Cadastrar e entrar' }));

    expect(await screen.findByText('A confirmacao da senha nao confere.')).toBeInTheDocument();
  });
});
