// Define todas as rotas do frontend e separa telas publicas das protegidas.
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminRoute } from '@/components/admin-route';
import { MasterRoute } from '@/components/master-route';
import { ProtectedRoute } from '@/components/protected-route';
import { ShellRoute } from '@/components/layout/shell-route';

const EntrarPage = lazy(() => import('@/pages/autenticacao/entrar-page').then((module) => ({ default: module.EntrarPage })));
const CadastroPage = lazy(() => import('@/pages/autenticacao/cadastro-page').then((module) => ({ default: module.CadastroPage })));
const EsqueciSenhaPage = lazy(() => import('@/pages/autenticacao/esqueci-senha-page').then((module) => ({ default: module.EsqueciSenhaPage })));
const RedefinirSenhaPage = lazy(() => import('@/pages/autenticacao/redefinir-senha-page').then((module) => ({ default: module.RedefinirSenhaPage })));
const PainelPage = lazy(() => import('@/pages/painel/painel-page').then((module) => ({ default: module.PainelPage })));
const PerfilPage = lazy(() => import('@/pages/perfil-page').then((module) => ({ default: module.PerfilPage })));
const PlanosPage = lazy(() => import('@/pages/planos/planos-page').then((module) => ({ default: module.PlanosPage })));
const FormularioPlanoPage = lazy(() => import('@/pages/planos/formulario-plano-page').then((module) => ({ default: module.FormularioPlanoPage })));
const AlunosPage = lazy(() => import('@/pages/alunos/alunos-page').then((module) => ({ default: module.AlunosPage })));
const FormularioAlunoPage = lazy(() => import('@/pages/alunos/formulario-aluno-page').then((module) => ({ default: module.FormularioAlunoPage })));
const TreinosPage = lazy(() => import('@/pages/treinos/treinos-page').then((module) => ({ default: module.TreinosPage })));
const FormularioTreinoPage = lazy(() => import('@/pages/treinos/formulario-treino-page').then((module) => ({ default: module.FormularioTreinoPage })));
const UsuariosPage = lazy(() => import('@/pages/usuarios/usuarios-page').then((module) => ({ default: module.UsuariosPage })));
const ImagensPage = lazy(() => import('@/pages/imagens/imagens-page').then((module) => ({ default: module.ImagensPage })));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-mesh px-6">
      <div className="rounded-lg border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slateblue shadow-sm">
        Carregando interface...
      </div>
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Telas publicas acessadas sem token. */}
        <Route path="/entrar" element={<EntrarPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/recuperar-senha" element={<EsqueciSenhaPage />} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
        {/* Area autenticada: primeiro valida token, depois renderiza o layout interno. */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ShellRoute />}>
            <Route path="/" element={<PainelPage />} />
            <Route path="/painel" element={<PainelPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/planos" element={<PlanosPage />} />
            <Route path="/alunos" element={<AlunosPage />} />
            <Route path="/treinos" element={<TreinosPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/planos/novo" element={<FormularioPlanoPage />} />
              <Route path="/planos/:id/editar" element={<FormularioPlanoPage />} />
              <Route path="/alunos/novo" element={<FormularioAlunoPage />} />
              <Route path="/alunos/:id/editar" element={<FormularioAlunoPage />} />
              <Route path="/treinos/novo" element={<FormularioTreinoPage />} />
              <Route path="/treinos/:id/editar" element={<FormularioTreinoPage />} />
              <Route path="/imagens" element={<ImagensPage />} />
            </Route>
            <Route element={<MasterRoute />}>
              <Route path="/usuarios" element={<UsuariosPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
