// Rota auxiliar que coloca o layout autenticado em volta das paginas internas.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { useAuth } from '@/hooks/use-auth';

export function ShellRoute() {
  const { user } = useAuth();
  const location = useLocation();
  const mustFinishFirstAccess = user?.mustChangePassword && location.pathname !== '/perfil';

  return (
    <AppShell>
      {mustFinishFirstAccess ? <Navigate to="/perfil" replace /> : <Outlet />}
    </AppShell>
  );
}
