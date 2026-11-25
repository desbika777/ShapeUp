import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

type MetricCardProps = {
  label: string;
  value: number | string;
};

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minWidth: 140,
    padding: spacing.md,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  value: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: '800',
  },
});
