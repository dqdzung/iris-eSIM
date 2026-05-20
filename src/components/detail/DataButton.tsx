import { Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';

interface DataButtonProps {
  amount: string;
  selectedData: string;
  handleSelectData: (data: string) => void;
}

const DataButton = ({ amount, selectedData, handleSelectData }: DataButtonProps) => {
  const { t } = useTranslation();
  const isSelected = selectedData === amount;
  const className = `rounded-lg p-4 ${isSelected ? 'bg-primary text-white' : 'bg-white drop-shadow'}`;

  return (
    <Pressable className={className} onPress={() => handleSelectData(amount)}>
      <Text className="text-center text-xs font-semibold text-inherit">
        {amount === '0GB' ? capitalize(t('unlimited')) : amount}
      </Text>
    </Pressable>
  );
};

export default DataButton;
