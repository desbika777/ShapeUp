import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { AuthResponse, AuthUser, UserLoginInput, UserRegistrationInput, UserUpdateInput } from '@shapeup/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '@/lib/api';

const STORAGE_KEY = 'shapeup:token';

function getStoredToken() {
  return localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
}

function persistToken(token: string, rememberAccess = true) {
  if (rememberAccess) {
    localStorage.setItem(STORAGE_KEY, token);
    sessionStorage.removeItem(STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, token);
  localStorage.removeItem(STORAGE_KEY);
}

function decodeJwtExp(token: string): number | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  if (typeof atob !== 'function') return null;

  try {
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(parts[1].length / 4) * 4, '=');

    const json = JSON.parse(atob(payload)) as { exp?: number };
    return typeof json.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
}

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: UserLoginInput, options?: { rememberAccess?: boolean }) => Promise<void>;
  register: (input: UserRegistrationInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (input: UserUpdateInput) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      const exp = decodeJwtExp(token);
      if (exp && exp * 1000 <= Date.now()) {
        logout();
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await apiRequest<AuthUser>('/users/me', { method: 'GET' }, token);
        setUser(currentUser);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, [logout, token]);

  useEffect(() => {
    function handleUnauthorized() {
      logout();
      navigate('/login', { replace: true });
    }

    window.addEventListener('shapeup:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('shapeup:unauthorized', handleUnauthorized);
  }, [logout, navigate]);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isLoading,
    async login(input, options) {
      const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      persistToken(response.token, options?.rememberAccess);
      setToken(response.token);
      setUser(response.user);
      queryClient.clear();
    },
    async register(input) {
      const response = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      persistToken(response.token);
      setToken(response.token);
      setUser(response.user);
      queryClient.clear();
    },
    logout,
    async refreshUser() {
      if (!token) return;
      const currentUser = await apiRequest<AuthUser>('/users/me', { method: 'GET' }, token);
      setUser(currentUser);
    },
    async updateProfile(input) {
      if (!token) return;
      const updatedUser = await apiRequest<AuthUser>('/users/me', {
        method: 'PUT',
        body: JSON.stringify(input),
      }, token);
      setUser(updatedUser);
    },
  }), [isLoading, logout, queryClient, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
