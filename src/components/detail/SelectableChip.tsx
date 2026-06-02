import { Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '@/constants/theme';

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const SelectableChip = ({ label, selected, onPress }: SelectableChipProps) => (
  <LinearGradient
    colors={[...(selected ? Gradients.primary : Gradients.transparent)]}
    className="rounded-lg p-[2px] drop-shadow">
    <Pressable
      onPress={onPress}
      className={`rounded-md p-4 ${selected ? 'bg-gray-100' : 'bg-white'}`}>
      <Text className={`text-center text-sm font-semibold ${selected ? 'text-primary' : ''}`}>
        {label}
      </Text>
    </Pressable>
  </LinearGradient>
);

export default SelectableChip;
