import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { Pressable } from 'react-native';

const NavHeader = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <LinearGradient
      colors={['rgba(112, 63, 203, 1)', 'rgba(69, 87, 236, 1)']}
      start={{ x: 0, y: 1 }}
      className="h-[64px] flex-row items-center gap-2 border-b-[1px] border-gray-300 bg-primary px-4">
      <Pressable onPress={handleBack}>
        <ChevronLeftIcon className="h-6 w-6 stroke-2 text-white" />
      </Pressable>
      {children}
    </LinearGradient>
  );
};

export default NavHeader;
