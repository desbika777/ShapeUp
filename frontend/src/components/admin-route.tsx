// Protege telas administrativas quando o usuario logado nao possui perfil ADMIN.
import { Outlet } from 'react-router-dom';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/hooks/use-auth';

export function AdminRoute() {
  const { user } = useAuth();

  if (user?.perfil !== 'ADMIN') {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Acesso restrito" title="Permissao administrativa necessaria" description="Seu perfil permite consultar informacoes, mas nao criar, editar ou remover registros administrativos." />
        <EmptyState title="Acao bloqueada" description="Entre com uma conta administradora para executar esta operacao." />
      </div>
    );
  }

  return <Outlet />;
}
