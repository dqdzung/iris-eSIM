import { Pressable, View } from 'react-native';

interface IosSwitchProps {
  value: boolean;
  onValueChange: () => void;
  disabled?: boolean;
}

const IosSwitch = ({ value, onValueChange, disabled = false }: IosSwitchProps) => (
  <Pressable
    onPress={onValueChange}
    disabled={disabled}
    className={`relative h-8 w-[72px] rounded-full transition-colors duration-200 ${value ? 'bg-primary' : 'bg-gray-200'} ${disabled ? 'cursor-not-allowed opacity-65' : ''}`}>
    <View
      className={`absolute left-[3px] top-[3px] h-[26px] w-10 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${value ? 'translate-x-[26px]' : ''}`}
    />
  </Pressable>
);

export default IosSwitch;
