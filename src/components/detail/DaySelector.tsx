import { View, Text } from 'react-native';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <View className="gap-2 rounded-lg">
      <View className="flex-row items-center gap-2">
        <CalendarDaysIcon className="h-5 w-5 text-primary" />
        <Text className="font-semibold text-primary">Thời gian</Text>
      </View>

      <View className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {props.dayOptions?.map((day: number) => (
          <DayButton key={day} day={day} {...props} />
        ))}
      </View>
    </View>
  );
};

export default DaySelector;
