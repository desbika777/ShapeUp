import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { RespostaAutenticacao } from '@shape/shared';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { DEFAULT_API_URL } from './src/lib/config';
import { colors } from './src/theme';

export default function App() {
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [session, setSession] = useState<RespostaAutenticacao | null>(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          {session ? (
            <DashboardScreen apiUrl={apiUrl} session={session} onLogout={() => setSession(null)} onSessionUpdate={setSession} />
          ) : (
            <LoginScreen apiUrl={apiUrl} onApiUrlChange={setApiUrl} onLogin={setSession} />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
