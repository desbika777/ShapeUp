import { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Aluno, IndicadoresPainel, Plano, RespostaAutenticacao, RespostaPaginada, Treino } from '@shape/shared';
import { Message } from '../components/Message';
import { apiRequest } from '../lib/api';
import { colors, spacing } from '../theme';
import { AlunosTab } from './dashboard/AlunosTab';
import { ClientesTab } from './dashboard/ClientesTab';
import { ContaTab } from './dashboard/ContaTab';
import { PainelTab } from './dashboard/PainelTab';
import { PlanosTab } from './dashboard/PlanosTab';
import { TreinosTab } from './dashboard/TreinosTab';
import type { DashboardData, DashboardTab } from './dashboard/types';

type DashboardScreenProps = {
  apiUrl: string;
  session: RespostaAutenticacao;
  onLogout: () => void;
  onSessionUpdate: (session: RespostaAutenticacao) => void;
};

const tabs: Array<{ key: DashboardTab; label: string; masterOnly?: boolean }> = [
  { key: 'painel', label: 'Painel' },
  { key: 'clientes', label: 'Clientes', masterOnly: true },
  { key: 'planos', label: 'Planos' },
  { key: 'alunos', label: 'Alunos' },
  { key: 'treinos', label: 'Treinos' },
  { key: 'conta', label: 'Conta' },
];

export function DashboardScreen({ apiUrl, session, onLogout, onSessionUpdate }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(session.user.mustChangePassword ? 'conta' : 'painel');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMaster = session.user.perfil === 'MASTER';
  const isAdmin = session.user.perfil === 'ADMIN' || isMaster;
  const visibleTabs = session.user.mustChangePassword ? tabs.filter((tab) => tab.key === 'conta') : tabs.filter((tab) => !tab.masterOnly || isMaster);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [indicators, plans, students, workouts] = await Promise.all([
        apiRequest<IndicadoresPainel>(apiUrl, '/painel/indicadores', { token: session.token }),
        apiRequest<RespostaPaginada<Plano>>(apiUrl, '/planos?page=1&pageSize=20', { token: session.token }),
        apiRequest<RespostaPaginada<Aluno>>(apiUrl, '/alunos?page=1&pageSize=20', { token: session.token }),
        apiRequest<RespostaPaginada<Treino>>(apiUrl, '/treinos?page=1&pageSize=20', { token: session.token }),
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
  }, [apiUrl, session.token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (session.user.mustChangePassword) {
      setActiveTab('conta');
    }
  }, [session.user.mustChangePassword]);

  function renderActiveTab() {
    if (error) {
      return <Message tone="danger" title="Erro ao carregar" body={error} />;
    }

    if (!data) {
      return <Message body="Carregando dados da academia..." />;
    }

    if (activeTab === 'painel') {
      return <PainelTab data={data} />;
    }

    if (activeTab === 'planos') {
      return <PlanosTab apiUrl={apiUrl} data={data} isAdmin={isAdmin} onRefresh={loadData} session={session} />;
    }

    if (activeTab === 'clientes') {
      return <ClientesTab apiUrl={apiUrl} session={session} />;
    }

    if (activeTab === 'alunos') {
      return <AlunosTab apiUrl={apiUrl} data={data} isAdmin={isAdmin} onRefresh={loadData} session={session} />;
    }

    if (activeTab === 'treinos') {
      return <TreinosTab apiUrl={apiUrl} data={data} isAdmin={isAdmin} onRefresh={loadData} session={session} />;
    }

    return <ContaTab apiUrl={apiUrl} onLogout={onLogout} onSessionUpdate={onSessionUpdate} session={session} />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>Shape Up Mobile</Text>
          <Text style={styles.title}>Gestao da academia</Text>
          <Text style={styles.subtitle}>{session.user.name} - {isMaster ? 'master Shape Up' : 'dono da academia'}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

      <View style={styles.tabBar}>
        {visibleTabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <Pressable key={tab.key} accessibilityRole="tab" onPress={() => setActiveTab(tab.key)} style={[styles.tab, active && styles.tabActive]}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {renderActiveTab()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  headerCopy: {
    flex: 1,
  },
  kicker: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#eef5ff',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  logoutText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  tabActive: {
    backgroundColor: colors.primaryDark,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  tabText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  title: {
    color: colors.primaryDark,
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 31,
  },
});
