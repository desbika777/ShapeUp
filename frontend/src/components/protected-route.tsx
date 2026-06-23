import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/brand-logo';
import { useAuth } from '@/hooks/use-auth';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero-mesh px-6">
        <div className="flex flex-col items-center gap-4 rounded-[32px] border border-white/60 bg-white/85 px-8 py-7 text-center shadow-panel backdrop-blur">
          <BrandLogo size="md" theme="dark" />
          <p className="font-body text-sm font-medium text-slate-500">Carregando seu ambiente de gestao...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
