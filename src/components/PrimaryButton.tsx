import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

const ENABLED_COLORS = ['rgba(58, 89, 237, 1)', 'rgba(125, 68, 225, 1)'] as const;
const DISABLED_COLORS = ['rgba(200, 200, 200, 1)', 'rgba(170, 170, 170, 1)'] as const;

type Props = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  pressableClassName?: string;
  label?: string;
  children?: ReactNode;
};

const PrimaryButton = ({
  onPress,
  disabled = false,
  loading = false,
  className = 'rounded-xl drop-shadow-md',
  pressableClassName = 'px-10 py-3',
  label,
  children,
}: Props) => {
  const isDisabled = disabled || loading;
  const content = children ?? <Text className="text-center font-semibold text-white">{label}</Text>;
  return (
    <LinearGradient
      className={`${isDisabled ? 'cursor-not-allowed' : ''} ${className}`}
      colors={[...(isDisabled ? DISABLED_COLORS : ENABLED_COLORS)]}>
      <Pressable disabled={isDisabled} onPress={onPress} className={pressableClassName}>
        <View style={{ opacity: loading ? 0 : 1 }}>{content}</View>
        {loading && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator color="white" />
          </View>
        )}
      </Pressable>
    </LinearGradient>
  );
};

export default PrimaryButton;
