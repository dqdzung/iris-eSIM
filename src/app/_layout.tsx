import { ToastProvider } from '@/components/Toast';
import { Colors } from '@/constants/theme';
import { GlobalDataProvider } from '@/contexts/GlobalDataContext';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <ToastProvider>
      <GlobalDataProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: '#fff',
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="detail/[id]" />
        </Stack>
      </GlobalDataProvider>
    </ToastProvider>
  );
}
