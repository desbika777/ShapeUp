import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Aluno, IndicadoresPainel, Plano, RespostaAutenticacao, RespostaPaginada, Treino } from '@shape/shared';
import { ActionButton } from '../components/ActionButton';
import { MetricCard } from '../components/MetricCard';
import { apiRequest } from '../lib/api';
import { colors, spacing } from '../theme';

type DashboardScreenProps = {
  apiUrl: string;
  session: RespostaAutenticacao;
  onLogout: () => void;
};

type MobileData = {
  indicators: IndicadoresPainel;
  plans: Plano[];
  students: Aluno[];
  workouts: Treino[];
};

export function DashboardScreen({ apiUrl, session, onLogout }: DashboardScreenProps) {
  const [data, setData] = useState<MobileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [indicators, plans, students, workouts] = await Promise.all([
        apiRequest<IndicadoresPainel>(apiUrl, '/painel/indicadores', { token: session.token }),
        apiRequest<RespostaPaginada<Plano>>(apiUrl, '/planos?page=1&pageSize=4', { token: session.token }),
        apiRequest<RespostaPaginada<Aluno>>(apiUrl, '/alunos?page=1&pageSize=4', { token: session.token }),
        apiRequest<RespostaPaginada<Treino>>(apiUrl, '/treinos?page=1&pageSize=4', { token: session.token }),
      ]);

      setData({
        indicators,
        plans: plans.data,
        students: students.data,
        workouts: workouts.data,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel carregar os dados.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const totals = data?.indicators.totals;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Shape Mobile</Text>
          <Text style={styles.title}>Painel da academia</Text>
          <Text style={styles.subtitle}>{session.user.name} - {session.user.perfil}</Text>
        </View>
        <ActionButton variant="secondary" onPress={onLogout}>
          Sair
        </ActionButton>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.metrics}>
        <MetricCard label="Alunos" value={totals?.students ?? '-'} />
        <MetricCard label="Planos ativos" value={totals?.activePlans ?? '-'} />
        <MetricCard label="Treinos" value={totals?.workouts ?? '-'} />
        <MetricCard label="Novos no mes" value={totals?.newStudentsThisMonth ?? '-'} />
      </View>

      <Section title="Planos" items={data?.plans.map((plan) => `${plan.name} - ${plan.status}`) ?? []} />
      <Section title="Alunos" items={data?.students.map((student) => `${student.name} - ${student.status}`) ?? []} />
      <Section title="Treinos" items={data?.workouts.map((workout) => `${workout.title} - ${workout.level}`) ?? []} />

      <View style={styles.securityBox}>
        <Text style={styles.securityTitle}>Validacao demonstravel</Text>
        <Text style={styles.securityText}>O app Expo consome a mesma API, exige JWT e respeita os dados do perfil autenticado.</Text>
      </View>
    </ScrollView>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.length ? (
        items.map((item) => (
          <Text key={item} style={styles.item}>
            {item}
          </Text>
        ))
      ) : (
        <Text style={styles.empty}>Nenhum registro para exibir.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  empty: {
    color: colors.muted,
    fontSize: 14,
  },
  error: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderRadius: 8,
    borderWidth: 1,
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
    padding: spacing.md,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  item: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: spacing.sm,
  },
  kicker: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  section: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  securityBox: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
  },
  securityText: {
    color: colors.success,
    fontSize: 14,
    lineHeight: 21,
  },
  securityTitle: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: '900',
  },
});
