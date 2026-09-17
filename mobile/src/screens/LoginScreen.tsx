import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { isValidEmail, type RespostaAutenticacao } from '@shape/shared';
import { ActionButton } from '../components/ActionButton';
import { TextInputField } from '../components/TextInputField';
import { apiRequest } from '../lib/api';
import { DETECTED_LAN_API_URL } from '../lib/config';
import { colors, spacing } from '../theme';

type LoginScreenProps = {
  apiUrl: string;
  onApiUrlChange: (value: string) => void;
  onLogin: (session: RespostaAutenticacao) => void;
};

export function LoginScreen({ apiUrl, onApiUrlChange, onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('admin@shape.com.br');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function getLoginApiUrl() {
    const normalizedApiUrl = apiUrl.trim();
    const isLoopback = /\/\/(127\.0\.0\.1|localhost)(:|\/)/.test(normalizedApiUrl);

    if (isLoopback && DETECTED_LAN_API_URL) {
      onApiUrlChange(DETECTED_LAN_API_URL);
      return DETECTED_LAN_API_URL;
    }

    return normalizedApiUrl;
  }

  async function handleSubmit() {
    const normalizedApiUrl = getLoginApiUrl();

    if (!normalizedApiUrl) {
      setError('Informe a URL da API.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Informe um e-mail valido.');
      return;
    }

    if (!password) {
      setError('Informe sua senha.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const session = await apiRequest<RespostaAutenticacao>(normalizedApiUrl, '/autenticacao/entrar', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      onLogin(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel entrar no Shape Up.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>Shape Up</Text>
          <Text style={styles.title}>Gestao mobile</Text>
          <Text style={styles.subtitle}>Conecte o Expo Go a API local para gerenciar a academia em dispositivo real.</Text>
        </View>

        <View style={styles.form}>
          <TextInputField label="URL da API" autoCapitalize="none" autoCorrect={false} value={apiUrl} onChangeText={onApiUrlChange} />
          {DETECTED_LAN_API_URL ? <Text style={styles.apiHint}>API detectada para o celular: {DETECTED_LAN_API_URL}</Text> : null}
          <TextInputField label="E-mail" autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextInputField label="Senha" secureTextEntry value={password} onChangeText={setPassword} />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <ActionButton loading={loading} onPress={handleSubmit}>
            Entrar
          </ActionButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  apiHint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: -spacing.xs,
  },
  form: {
    gap: spacing.md,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  brand: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  title: {
    color: colors.primaryDark,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
});
