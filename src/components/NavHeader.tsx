import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

const NavHeader = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <View className="h-[64px] flex-row items-center gap-2 border-b-[1px] border-gray-300 bg-primary px-4">
      <Pressable onPress={handleBack}>
        <ChevronLeftIcon className="h-6 w-6 stroke-2 text-white" />
      </Pressable>
      {children}
    </View>
  );
};

export default NavHeader;
