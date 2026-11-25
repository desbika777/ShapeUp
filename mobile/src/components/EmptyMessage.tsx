import { StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export function EmptyMessage({ children }: { children: string }) {
  return <Text style={styles.empty}>{children}</Text>;
}

const styles = StyleSheet.create({
  empty: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
