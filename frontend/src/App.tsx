// Define todas as rotas do frontend e separa telas publicas das protegidas.
import { Route, Routes } from 'react-router-dom';
import { AdminRoute } from '@/components/admin-route';
import { ProtectedRoute } from '@/components/protected-route';
import { ShellRoute } from '@/components/layout/shell-route';
import { EsqueciSenhaPage } from '@/pages/autenticacao/esqueci-senha-page';
import { EntrarPage } from '@/pages/autenticacao/entrar-page';
import { CadastroPage } from '@/pages/autenticacao/cadastro-page';
import { RedefinirSenhaPage } from '@/pages/autenticacao/redefinir-senha-page';
import { PainelPage } from '@/pages/painel/painel-page';
import { PerfilPage } from '@/pages/perfil-page';
import { FormularioPlanoPage } from '@/pages/planos/formulario-plano-page';
import { PlanosPage } from '@/pages/planos/planos-page';
import { FormularioAlunoPage } from '@/pages/alunos/formulario-aluno-page';
import { AlunosPage } from '@/pages/alunos/alunos-page';
import { FormularioTreinoPage } from '@/pages/treinos/formulario-treino-page';
import { TreinosPage } from '@/pages/treinos/treinos-page';
import { UsuariosPage } from '@/pages/usuarios/usuarios-page';

export function App() {
  return (
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
            <Route path="/usuarios" element={<UsuariosPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
