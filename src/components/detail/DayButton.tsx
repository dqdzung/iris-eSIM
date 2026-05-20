import { Pressable, Text } from 'react-native';

interface DayButtonProps {
  day: number;
  selectedDay: number;
  handleSelectDay: (day: number) => void;
}

const DayButton = ({ day, selectedDay, handleSelectDay }: DayButtonProps) => {
  const isSelected = selectedDay === day;
  const className = `rounded-lg p-4 ${isSelected ? 'bg-primary text-white' : 'bg-white drop-shadow'}`;

  return (
    <Pressable key={day} onPress={() => handleSelectDay(day)} className={className}>
      <Text className="text-center text-xs font-semibold text-inherit">{day}</Text>
    </Pressable>
  );
};

export default DayButton;
