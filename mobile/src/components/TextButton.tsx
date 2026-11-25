import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../theme';

type TextButtonProps = {
  label: string;
  tone?: 'default' | 'danger';
  onPress: () => void;
};

export function TextButton({ label, tone = 'default', onPress }: TextButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.textButton}>
      <Text style={[styles.textButtonText, tone === 'danger' && styles.textButtonDanger]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  textButton: {
    paddingVertical: spacing.xs,
  },
  textButtonDanger: {
    color: colors.danger,
  },
  textButtonText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '900',
  },
});
