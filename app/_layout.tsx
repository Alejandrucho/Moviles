import { Stack } from 'expo-router';
import { AppProvider } from './context';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="index" options={{ title: 'DermaWiki' }} />
        <Stack.Screen name="diagnostico" options={{ title: 'Diagnóstico' }} />
        <Stack.Screen name="historial" options={{ title: 'Historial' }} />
        <Stack.Screen name="enfermedades" options={{ title: 'Enfermedades' }} />
      </Stack>
    </AppProvider>
  );
}