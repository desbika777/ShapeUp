import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import { colors, spacing } from '../theme';

type TextInputFieldProps = TextInputProps & {
  label: string;
};

export function TextInputField({ label, style, ...props }: TextInputFieldProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor="#94a3b8" style={[styles.input, style]} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.xs,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
