import { View, Text } from 'react-native';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import DayButton from './DayButton';

interface DaySelectorProps {
  dayOptions: number[];
  selectedDay: number;
  handleSelectDay: (day: number) => void;
}

const DaySelector = ({ dayOptions, selectedDay, handleSelectDay }: DaySelectorProps) => {
  const { t } = useTranslation();
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <CalendarDaysIcon className="h-5 w-5 text-primary" />
        <Text className="font-semibold capitalize text-primary">{t('duration')}</Text>
      </View>

      <View className="grid grid-cols-6 gap-3 sm:grid-cols-8">
        {dayOptions.map((day) => (
          <DayButton
            key={day}
            day={day}
            selectedDay={selectedDay}
            handleSelectDay={handleSelectDay}
          />
        ))}
      </View>
    </View>
  );
};

export default DaySelector;
