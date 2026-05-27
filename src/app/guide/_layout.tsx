import { Stack, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import CallButton from '@/components/CallButton';
import DotStrip from '@/components/DotStrip';
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
            <NavHeader>
              <View className="flex-1 flex-row items-center justify-between">
                <Text className="text-base font-medium text-white" numberOfLines={1}>
                  {String(options.title ?? '')}
                </Text>
                <View className="flex-row items-center gap-3">
                  <DotStrip />
                  <CallButton />
                  <View className="h-5 w-px bg-white" />
                  <Pressable onPress={handleGoHome}>
                    <House className="h-5 w-5 stroke-2 font-bold text-white" />
                  </Pressable>
                </View>
              </View>
            </NavHeader>
          ),
        }}
      />
    </>
  );
}
