import { Platform } from 'react-native';

const emulatorApiUrl = Platform.select({
  android: 'http://10.0.2.2:3333/api',
  ios: 'http://127.0.0.1:3333/api',
  default: 'http://127.0.0.1:3333/api',
});

export const DEFAULT_API_URL = process.env.EXPO_PUBLIC_API_URL ?? emulatorApiUrl ?? 'http://127.0.0.1:3333/api';
