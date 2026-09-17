import { NativeModules, Platform } from 'react-native';

function getMetroHost() {
  const sourceCode = NativeModules.SourceCode as { scriptURL?: string } | undefined;
  const scriptUrl = sourceCode?.scriptURL ?? '';
  const match = /^https?:\/\/([^/:]+)/.exec(scriptUrl);
  const host = match?.[1];

  if (!host || ['localhost', '127.0.0.1', '0.0.0.0'].includes(host)) {
    return null;
  }

  return host;
}

const metroHost = getMetroHost();
const detectedLanApiUrl = metroHost ? `http://${metroHost}:3333/api` : null;

const simulatorApiUrl = Platform.select({
  android: 'http://10.0.2.2:3333/api',
  ios: 'http://127.0.0.1:3333/api',
  default: 'http://127.0.0.1:3333/api',
});

export const DEFAULT_API_URL = process.env.EXPO_PUBLIC_API_URL ?? detectedLanApiUrl ?? simulatorApiUrl ?? 'http://127.0.0.1:3333/api';
export const DETECTED_LAN_API_URL = detectedLanApiUrl;
