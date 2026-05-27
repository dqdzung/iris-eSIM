import { Pressable } from 'react-native';
import { SUPPORT_PHONE } from '@/constants';
import { Headset } from 'lucide-react';

const CallButton = () => {
  const handlePress = () => {
    if (typeof window !== 'undefined') window.location.href = `tel:${SUPPORT_PHONE}`;
  };

  return (
    <Pressable onPress={handlePress}>
      <Headset className="h-5 w-5 stroke-2 font-bold text-white" />
    </Pressable>
  );
};

export default CallButton;
