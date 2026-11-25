import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

type MessageProps = {
  body: string;
  title?: string;
  tone?: 'success' | 'danger' | 'info';
};

export function Message({ body, title, tone = 'info' }: MessageProps) {
  const toneStyles = {
    danger: {
      box: styles.messageDanger,
      text: styles.dangerText,
    },
    info: {
      box: styles.messageInfo,
      text: styles.infoText,
    },
    success: {
      box: styles.messageSuccess,
      text: styles.successText,
    },
  }[tone];

  return (
    <View style={[styles.message, toneStyles.box]}>
      {title ? <Text style={[styles.messageTitle, toneStyles.text]}>{title}</Text> : null}
      <Text style={[styles.messageBody, toneStyles.text]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dangerText: {
    color: colors.danger,
  },
  infoText: {
    color: colors.primaryDark,
  },
  message: {
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
  },
  messageBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  messageDanger: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  messageInfo: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  messageSuccess: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  messageTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  successText: {
    color: colors.success,
  },
});
