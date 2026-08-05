// Testes do AuthProvider: validam persistencia do token local e por sessao.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AuthResponse } from '@shape/shared';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/context/auth-context';
import { useAuth } from '@/hooks/use-auth';

function Harness() {
  // Exponhe botoes simples para acionar login em dois modos.
  const { login, user } = useAuth();
  return (
    <div>
      <button onClick={() => login({ email: 'gestor@shape.com.br', password: 'Shape@123' })}>lembrar</button>
      <button onClick={() => login({ email: 'gestor@shape.com.br', password: 'Shape@123' }, { rememberAccess: false })}>sessao</button>
      <span>{user?.email ?? 'sem-usuario'}</span>
    </div>
  );
}

afterEach(() => {
  // Limpa ambiente do navegador simulado entre testes.
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe('AuthProvider', () => {
  it('armazena token no localStorage apos login', async () => {
    const response: AuthResponse = {
      token: 'jwt-token',
      user: {
        id: '1',
        name: 'Gestor',
        email: 'gestor@shape.com.br',
        cpf: '11144477735',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith('/autenticacao/entrar')) {
          return { ok: true, status: 200, json: async () => response };
        }
        return { ok: true, status: 200, json: async () => response.user };
      }),
    );

    const queryClient = new QueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <Harness />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'lembrar' }));

    await waitFor(() => expect(localStorage.getItem('shape:token')).toBe('jwt-token'));
    expect(sessionStorage.getItem('shape:token')).toBeNull();
    await waitFor(() => expect(screen.getByText('gestor@shape.com.br')).toBeInTheDocument());
  });

  it('armazena token no sessionStorage quando login nao deve ser lembrado', async () => {
    const response: AuthResponse = {
      token: 'jwt-token',
      user: {
        id: '1',
        name: 'Gestor',
        email: 'gestor@shape.com.br',
        cpf: '11144477735',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith('/autenticacao/entrar')) {
          return { ok: true, status: 200, json: async () => response };
        }
        return { ok: true, status: 200, json: async () => response.user };
      }),
    );

    const queryClient = new QueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <Harness />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'sessao' }));

    await waitFor(() => expect(sessionStorage.getItem('shape:token')).toBe('jwt-token'));
    expect(localStorage.getItem('shape:token')).toBeNull();
    await waitFor(() => expect(screen.getByText('gestor@shape.com.br')).toBeInTheDocument());
  });
});
