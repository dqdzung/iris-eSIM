import { Pressable, Text } from 'react-native';
import { Package } from '@/types';

interface DayButtonProps {
  day: number;
  selectedDay: number;
  validDayOptions: number[];
  handleSelectDay: (day: number) => void;
  isTiktokSupported: boolean;
  packages: Package[];
  selectedData: string;
}

const DayButton = ({
  day,
  selectedDay,
  validDayOptions,
  handleSelectDay,
  isTiktokSupported,
  packages,
  selectedData,
}: DayButtonProps) => {
  const isDayValid = selectedData ? validDayOptions.includes(day) : true;
  const supportTiktokCheck = !isTiktokSupported
    ? true
    : packages.some((item: any) => item.validity_days === day && item.tiktok === 'ENABLE');
  const isValid = isDayValid && supportTiktokCheck;

  const baseClass = 'rounded-lg p-4';
  const selectedStyle = `${selectedDay === day ? 'bg-primary text-white' : 'bg-white'}`;
  const validStyle = `${!isValid ? 'cursor-not-allowed border-white/5 text-gray-300' : 'drop-shadow'}`;
  // const hoverStyle = `${selectedDay !== day && isValid ? 'hover:bg-primary/20' : ''}`;

  // const className = `${baseClass} ${selectedStyle} ${validStyle} ${hoverStyle}`;
  const className = `${baseClass} ${selectedStyle} ${validStyle}`;

  return (
    <Pressable key={day} onPress={() => handleSelectDay(day)} className={className}>
      <Text className="text-center text-xs font-semibold text-inherit">{day}</Text>
    </Pressable>
  );
};

export default DayButton;
