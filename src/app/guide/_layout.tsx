import { Stack, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import NavHeader from '@/components/NavHeader';
import { House } from 'lucide-react';

export default function GuideLayout() {
  const router = useRouter();
  const handleGoHome = () => router.dismissTo('/');

  return (
    <>
      {/* Hide the parent (root) stack's header for everything under /guide. */}
      <Stack.Screen options={{ headerShown: false }} />

      <Stack
        screenOptions={{
          header: ({ options }) => (
            <NavHeader
              actions={
                <Pressable onPress={handleGoHome}>
                  <House className="h-5 w-5 stroke-2 font-bold text-white" />
                </Pressable>
              }>
              <Text className="text-base font-medium text-white" numberOfLines={1}>
                {String(options.title ?? '')}
              </Text>
            </NavHeader>
          ),
        }}
      />
    </>
  );
}
