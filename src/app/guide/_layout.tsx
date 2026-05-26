import { Stack, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { HomeIcon } from '@heroicons/react/24/outline';
import NavHeader from '@/components/NavHeader';

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
                <Text className="text-[16px] font-medium text-white" numberOfLines={1}>
                  {String(options.title ?? '')}
                </Text>
                <Pressable onPress={handleGoHome}>
                  <HomeIcon className="h-5 w-5 stroke-2 font-bold text-white" />
                </Pressable>
              </View>
            </NavHeader>
          ),
        }}
      />
    </>
  );
}
