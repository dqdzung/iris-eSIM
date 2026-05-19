import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

const ENABLED_COLORS = ['rgba(58, 89, 237, 1)', 'rgba(125, 68, 225, 1)'] as const;
const DISABLED_COLORS = ['rgba(200, 200, 200, 1)', 'rgba(170, 170, 170, 1)'] as const;

type Props = {
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  pressableClassName?: string;
  label?: string;
  children?: ReactNode;
};

const PrimaryButton = ({
  onPress,
  disabled = false,
  className = 'rounded-xl drop-shadow-md',
  pressableClassName = 'px-10 py-3',
  label,
  children,
}: Props) => {
  return (
    <LinearGradient
      className={`${disabled ? 'cursor-not-allowed' : ''} ${className}`}
      colors={[...(disabled ? DISABLED_COLORS : ENABLED_COLORS)]}>
      <Pressable disabled={disabled} onPress={onPress} className={pressableClassName}>
        {children ?? <Text className="text-center font-semibold text-white">{label}</Text>}
      </Pressable>
    </LinearGradient>
  );
};

export default PrimaryButton;
