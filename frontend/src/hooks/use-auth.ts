// Hook curto para acessar o AuthContext nas paginas.
import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';

export function useAuth() {
  const context = useContext(AuthContext);
  // Protecao para evitar uso fora do AuthProvider.
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
