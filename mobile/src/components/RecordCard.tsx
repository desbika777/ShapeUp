import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

export type RecordDetail = {
  label: string;
  value: string;
};

type RecordCardProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  details: RecordDetail[];
  actions?: ReactNode;
};

export function RecordCard({ actions, badge, details, subtitle, title }: RecordCardProps) {
  return (
    <View style={styles.record}>
      <View style={styles.recordHeader}>
        <View style={styles.recordCopy}>
          <Text style={styles.recordTitle}>{title}</Text>
          {subtitle ? <Text style={styles.recordSubtitle}>{subtitle}</Text> : null}
        </View>
        {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      </View>

      <View style={styles.detailGrid}>
        {details.map((detail) => (
          <View key={detail.label} style={styles.detail}>
            <Text style={styles.detailLabel}>{detail.label}</Text>
            <Text style={styles.detailValue}>{detail.value}</Text>
          </View>
        ))}
      </View>

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
  badge: {
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  detail: {
    flex: 1,
    minWidth: 130,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 4,
  },
  record: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
  },
  recordCopy: {
    flex: 1,
    minWidth: 0,
  },
  recordHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  recordSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  recordTitle: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 23,
  },
});
