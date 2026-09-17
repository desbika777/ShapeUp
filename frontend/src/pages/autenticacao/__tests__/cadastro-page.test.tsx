// Testes da tela de cadastro: garantem que o acesso publico permanece controlado.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
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
  it('explica o fluxo controlado sem exibir formulario publico', () => {
    renderCadastroPage();

    expect(screen.getByRole('heading', { name: 'Cadastro liberado pela Shape Up' })).toBeInTheDocument();
    expect(screen.getByText(/O Shape Up nao permite auto cadastro publico/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cadastrar e entrar' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entrar com acesso' })).toBeInTheDocument();
  });
});
