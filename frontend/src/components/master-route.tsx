// Protege telas exclusivas da conta master Shape Up.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export function MasterRoute() {
  const { user } = useAuth();

  if (user?.perfil !== 'MASTER') {
    return <Navigate to="/painel" replace />;
  }

  return <Outlet />;
}
