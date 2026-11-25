import { useState } from 'react';
import type { RespostaAutenticacao, UsuarioAutenticado } from '@shape/shared';
import { ActionButton } from '../../components/ActionButton';
import { Message } from '../../components/Message';
import { RecordCard } from '../../components/RecordCard';
import { Section } from '../../components/Section';
import { TextInputField } from '../../components/TextInputField';
import { apiRequest } from '../../lib/api';
import type { DashboardTabProps } from './types';

type ContaTabProps = Pick<DashboardTabProps, 'apiUrl' | 'session'> & {
  onLogout: () => void;
  onSessionUpdate: (session: RespostaAutenticacao) => void;
};

export function ContaTab({ apiUrl, onLogout, onSessionUpdate, session }: ContaTabProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const mustChangePassword = session.user.mustChangePassword;

  async function savePassword() {
    setFeedback('');
    setError('');

    if (!currentPassword || !password || !confirmPassword) {
      setError('Informe a senha provisoria, a nova senha e a confirmacao.');
      return;
    }

    setSaving(true);

    try {
      const updatedUser = await apiRequest<UsuarioAutenticado>(apiUrl, '/usuarios/me', {
        method: 'PUT',
        token: session.token,
        body: JSON.stringify({
          name: session.user.name,
          cpf: session.user.cpf,
          currentPassword,
          password,
          confirmPassword,
        }),
      });

      onSessionUpdate({ ...session, user: updatedUser });
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      setFeedback('Senha atualizada. Seu painel esta liberado.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel atualizar a senha.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section title={mustChangePassword ? 'Primeiro acesso' : 'Conta'}>
      {mustChangePassword ? (
        <Message
          title="Troque a senha provisoria"
          body="Use a senha recebida no campo atual e defina uma senha propria para liberar o painel da academia."
        />
      ) : null}
      <RecordCard
        title={session.user.name}
        subtitle={session.user.email}
        badge={session.user.perfil === 'ADMIN' ? 'Dono da academia' : 'Master Shape Up'}
        details={[
          { label: 'CPF', value: session.user.cpf },
          { label: 'API conectada', value: apiUrl },
        ]}
      />
      <TextInputField label={mustChangePassword ? 'Senha provisoria atual' : 'Senha atual'} secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
      <TextInputField label="Nova senha" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInputField label="Confirmar nova senha" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      {error ? <Message tone="danger" body={error} /> : null}
      {feedback ? <Message tone="success" body={feedback} /> : null}
      <ActionButton loading={saving} onPress={savePassword}>{mustChangePassword ? 'Definir senha e continuar' : 'Atualizar senha'}</ActionButton>
      <ActionButton variant="secondary" onPress={onLogout}>Sair da conta</ActionButton>
    </Section>
  );
}
