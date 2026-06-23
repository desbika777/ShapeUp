import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AuthResponse } from '@shapeup/shared';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/context/auth-context';
import { useAuth } from '@/hooks/use-auth';

function Harness() {
  const { login, user } = useAuth();
  return (
    <div>
      <button onClick={() => login({ email: 'gestor@shapeup.com', password: 'ShapeUp@123' })}>lembrar</button>
      <button onClick={() => login({ email: 'gestor@shapeup.com', password: 'ShapeUp@123' }, { rememberAccess: false })}>sessao</button>
      <span>{user?.email ?? 'sem-usuario'}</span>
    </div>
  );
}

afterEach(() => {
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
        email: 'gestor@shapeup.com',
        cpf: '11144477735',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith('/auth/login')) {
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

    await waitFor(() => expect(localStorage.getItem('shapeup:token')).toBe('jwt-token'));
    expect(sessionStorage.getItem('shapeup:token')).toBeNull();
    await waitFor(() => expect(screen.getByText('gestor@shapeup.com')).toBeInTheDocument());
  });

  it('armazena token no sessionStorage quando login nao deve ser lembrado', async () => {
    const response: AuthResponse = {
      token: 'jwt-token',
      user: {
        id: '1',
        name: 'Gestor',
        email: 'gestor@shapeup.com',
        cpf: '11144477735',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith('/auth/login')) {
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

    await waitFor(() => expect(sessionStorage.getItem('shapeup:token')).toBe('jwt-token'));
    expect(localStorage.getItem('shapeup:token')).toBeNull();
    await waitFor(() => expect(screen.getByText('gestor@shapeup.com')).toBeInTheDocument());
  });
});
