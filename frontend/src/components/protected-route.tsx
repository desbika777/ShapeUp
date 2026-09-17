// Protege telas internas, bloqueando acesso sem usuario autenticado.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/brand-logo';
import { useAuth } from '@/hooks/use-auth';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Enquanto o token salvo e validado, exibimos carregamento elegante.
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero-mesh px-6">
        <div className="flex flex-col items-center gap-4 rounded-lg border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
          <BrandLogo size="md" theme="dark" />
          <p className="font-body text-sm font-medium text-slate-500">Carregando seu ambiente de gestao...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para login guardando a rota desejada para voltar apos autenticar.
    return <Navigate to="/entrar" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
