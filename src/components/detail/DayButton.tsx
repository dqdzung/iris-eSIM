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

  const baseClass = 'rounded-md border border-primary p-2';
  const selectedStyle = `${selectedDay === day ? 'bg-primary text-white shadow-md' : 'bg-gray-200'}`;
  const validStyle = `${!isValid ? 'cursor-not-allowed border-white/5 text-gray-400' : ''}`;
  const hoverStyle = `${selectedDay !== day && isValid ? 'hover:bg-primary/20' : ''}`;

  const className = `${baseClass} ${selectedStyle} ${validStyle} ${hoverStyle}`;

  return (
    <Pressable key={day} onPress={() => handleSelectDay(day)} className={className}>
      <Text className="text-center text-xs text-inherit">{day}</Text>
    </Pressable>
  );
};

export default DayButton;
