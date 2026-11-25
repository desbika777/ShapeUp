import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

export type Option<T extends string> = {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
};

type OptionGroupProps<T extends string> = {
  label: string;
  options: Array<Option<T>>;
  value: T;
  emptyMessage?: string;
  onChange: (value: T) => void;
};

export function OptionGroup<T extends string>({ emptyMessage = 'Nenhuma opcao disponivel.', label, options, value, onChange }: OptionGroupProps<T>) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      {options.length ? (
        <View style={styles.options}>
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                disabled={option.disabled}
                onPress={() => onChange(option.value)}
                style={[styles.option, selected && styles.optionSelected, option.disabled && styles.optionDisabled]}
              >
                <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option.label}</Text>
                {option.description ? <Text style={[styles.optionDescription, selected && styles.optionDescriptionSelected]}>{option.description}</Text> : null}
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={styles.empty}>{emptyMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  group: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  option: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  optionDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  optionDescriptionSelected: {
    color: '#dbeafe',
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  optionLabelSelected: {
    color: '#ffffff',
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  options: {
    gap: spacing.xs,
  },
});
