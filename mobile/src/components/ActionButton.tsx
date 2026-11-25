import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type ActionButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  onPress: () => void;
};

export function ActionButton({ children, disabled, loading, variant = 'primary', onPress }: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        (pressed || disabled || loading) && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color={isPrimary ? '#ffffff' : colors.primary} /> : <Text style={isPrimary ? styles.primaryText : styles.secondaryText}>{children}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: '#eaf1ff',
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
  },
});
