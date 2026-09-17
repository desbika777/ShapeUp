import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import type { EntradaCriacaoUsuario, RespostaAutenticacao, UsuarioAutenticado } from '@shape/shared';
import { ActionButton } from '../../components/ActionButton';
import { EmptyMessage } from '../../components/EmptyMessage';
import { Message } from '../../components/Message';
import { RecordCard } from '../../components/RecordCard';
import { Section } from '../../components/Section';
import { TextButton } from '../../components/TextButton';
import { TextInputField } from '../../components/TextInputField';
import { apiRequest } from '../../lib/api';
import { onlyDigits } from '../../lib/format';
import { spacing } from '../../theme';

type ClientesTabProps = {
  apiUrl: string;
  session: RespostaAutenticacao;
};

type ClientFormState = {
  name: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword: string;
};

function pick(chars: string) {
  return chars[Math.floor(Math.random() * chars.length)];
}

function gerarSenhaInicial() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '@#$%';
  const all = `${upper}${lower}${numbers}${symbols}`;
  const chars = [pick(upper), pick(lower), pick(numbers), pick(symbols), ...Array.from({ length: 6 }, () => pick(all))];

  return chars.sort(() => Math.random() - 0.5).join('');
}

function createDefaultClientForm(): ClientFormState {
  const password = gerarSenhaInicial();
  return {
    name: '',
    email: '',
    cpf: '',
    password,
    confirmPassword: password,
  };
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export function ClientesTab({ apiUrl, session }: ClientesTabProps) {
  const [clients, setClients] = useState<UsuarioAutenticado[]>([]);
  const [form, setForm] = useState<ClientFormState>(() => createDefaultClientForm());
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadClients() {
    setLoading(true);
    setFeedback('');

    try {
      const payload = await apiRequest<UsuarioAutenticado[]>(apiUrl, '/usuarios', { token: session.token });
      setClients(payload.filter((client) => client.perfil === 'ADMIN'));
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel carregar os clientes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadClients();
  }, [apiUrl, session.token]);

  function updateForm<Key extends keyof ClientFormState>(key: Key, value: ClientFormState[Key]) {
    setFeedback('');
    setForm((current) => ({ ...current, [key]: key === 'cpf' ? formatCpf(value) : value }));
  }

  function generatePassword() {
    const password = gerarSenhaInicial();
    setFeedback('Senha provisoria gerada. O cliente define a senha propria no primeiro acesso.');
    setForm((current) => ({ ...current, password, confirmPassword: password }));
  }

  async function createClient() {
    if (form.name.trim().length < 3) {
      setFeedback('Informe o nome do dono da academia.');
      return;
    }

    if (!form.email.includes('@')) {
      setFeedback('Informe um e-mail valido.');
      return;
    }

    if (onlyDigits(form.cpf).length !== 11) {
      setFeedback('Informe um CPF com 11 digitos.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFeedback('A confirmacao da senha nao confere.');
      return;
    }

    setSaving(true);
    setFeedback('');

    const body: EntradaCriacaoUsuario = {
      confirmPassword: form.confirmPassword,
      cpf: onlyDigits(form.cpf),
      email: form.email.trim(),
      name: form.name.trim(),
      password: form.password,
      perfil: 'ADMIN',
    };

    try {
      await apiRequest<UsuarioAutenticado>(apiUrl, '/usuarios', {
        body: JSON.stringify(body),
        method: 'POST',
        token: session.token,
      });
      setForm(createDefaultClientForm());
      setFeedback('Cliente cadastrado. Ele deve trocar a senha no primeiro acesso.');
      await loadClients();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel cadastrar o cliente.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteClient(client: UsuarioAutenticado) {
    setSaving(true);
    setFeedback('');

    try {
      await apiRequest<void>(apiUrl, `/usuarios/${client.id}`, {
        method: 'DELETE',
        token: session.token,
      });
      setFeedback('Cliente excluido com sucesso.');
      await loadClients();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel excluir o cliente.');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(client: UsuarioAutenticado) {
    Alert.alert('Excluir cliente', `Deseja excluir ${client.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => void deleteClient(client) },
    ]);
  }

  return (
    <>
      <Section title="Novo cliente">
        <View style={styles.form}>
          <TextInputField label="Nome do dono" value={form.name} onChangeText={(value) => updateForm('name', value)} />
          <TextInputField label="E-mail" value={form.email} onChangeText={(value) => updateForm('email', value)} autoCapitalize="none" keyboardType="email-address" />
          <TextInputField label="CPF" value={form.cpf} onChangeText={(value) => updateForm('cpf', value)} keyboardType="number-pad" />
          <TextInputField label="Senha provisoria" value={form.password} onChangeText={(value) => updateForm('password', value)} />
          <ActionButton variant="secondary" onPress={generatePassword}>Gerar outra senha</ActionButton>
          <TextInputField label="Confirmar senha" value={form.confirmPassword} onChangeText={(value) => updateForm('confirmPassword', value)} />

          {feedback ? <Message tone={feedback.includes('sucesso') || feedback.includes('gerada') || feedback.includes('cadastrado') ? 'success' : 'danger'} body={feedback} /> : null}

          <ActionButton loading={saving} onPress={createClient}>Cadastrar cliente</ActionButton>
        </View>
      </Section>

      <Section title="Clientes cadastrados">
        {loading ? <Message body="Carregando clientes..." /> : null}
        {!loading && clients.length === 0 ? <EmptyMessage>Nenhum cliente cadastrado.</EmptyMessage> : null}
        {!loading ? clients.map((client) => (
          <RecordCard
            key={client.id}
            title={client.name}
            subtitle={client.email}
            badge="Dono da academia"
            details={[
              { label: 'CPF', value: formatCpf(client.cpf) },
              { label: 'Criado em', value: new Date(client.createdAt).toLocaleDateString('pt-BR') },
            ]}
            actions={(
              <View style={styles.cardActions}>
                <TextButton label="Excluir" tone="danger" onPress={() => confirmDelete(client)} />
              </View>
            )}
          />
        )) : null}
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  cardActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
});
