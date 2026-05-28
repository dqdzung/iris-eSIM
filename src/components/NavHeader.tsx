import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronLeft } from 'lucide-react';
import CallButton from './CallButton';
import DotStrip from './DotStrip';

type Props = {
  children: ReactNode;
  actions?: ReactNode;
  showCallButton?: boolean;
};

const NavHeader = ({ children, actions, showCallButton = true }: Props) => {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <LinearGradient
      colors={['rgba(112, 63, 203, 1)', 'rgba(69, 87, 236, 1)']}
      start={{ x: 0, y: 1 }}
      className="h-[55px] flex-row items-center gap-2 bg-primary px-4">
      <Pressable onPress={handleBack}>
        <ChevronLeft className="h-6 w-6 stroke-2 text-white" />
      </Pressable>

      {actions !== undefined ? (
        <View className="flex-1 flex-row items-center justify-between">
          {children}
          <View className="flex-row items-center gap-3">
            <DotStrip />
            {showCallButton && (
              <>
                <CallButton />
                <View className="h-5 w-px bg-white" />
              </>
            )}
            {actions}
          </View>
        </View>
      ) : (
        children
      )}
    </LinearGradient>
  );
};

export default NavHeader;
