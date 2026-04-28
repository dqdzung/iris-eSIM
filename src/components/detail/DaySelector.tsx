import { View, Text } from 'react-native';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Package } from '@/types';
import DayButton from './DayButton';

interface DaySelectorProps {
  dayOptions: number[];
  selectedDay: number;
  validDayOptions: number[];
  handleSelectDay: (day: number) => void;
  isTiktokSupported: boolean;
  packages: Package[];
  selectedData: string;
}

const DaySelector = (props: DaySelectorProps) => {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <CalendarDaysIcon className="h-5 w-5 text-primary" />
        <Text className="font-semibold text-primary">Thời gian</Text>
      </View>

      <View className="grid grid-cols-6 sm:grid-cols-8 gap-3">
        {props.dayOptions?.map((day: number) => (
          <DayButton key={day} day={day} {...props} />
        ))}
      </View>
    </View>
  );
};

export default DaySelector;
