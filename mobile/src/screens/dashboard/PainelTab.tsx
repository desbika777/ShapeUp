import { StyleSheet, View } from 'react-native';
import { EmptyMessage } from '../../components/EmptyMessage';
import { MetricCard } from '../../components/MetricCard';
import { RecordCard } from '../../components/RecordCard';
import { Section } from '../../components/Section';
import { formatDate, formatStudentStatus } from '../../lib/format';
import { spacing } from '../../theme';
import type { DashboardTabProps } from './types';

export function PainelTab({ data }: Pick<DashboardTabProps, 'data'>) {
  return (
    <>
      <View style={styles.metrics}>
        <MetricCard label="Alunos" value={data.indicators.totals.students} />
        <MetricCard label="Planos ativos" value={data.indicators.totals.activePlans} />
        <MetricCard label="Treinos" value={data.indicators.totals.workouts} />
        <MetricCard label="Novos no mes" value={data.indicators.totals.newStudentsThisMonth} />
      </View>

      <Section title="Alunos recentes">
        {data.indicators.recentStudents.length ? (
          data.indicators.recentStudents.map((student) => (
            <RecordCard
              key={student.id}
              title={student.name}
              badge={formatStudentStatus(student.status)}
              details={[
                { label: 'Objetivo', value: student.goal },
                { label: 'Entrada', value: formatDate(student.createdAt) },
              ]}
            />
          ))
        ) : (
          <EmptyMessage>Nenhum aluno recente para exibir.</EmptyMessage>
        )}
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
