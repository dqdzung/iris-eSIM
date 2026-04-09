import { Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { Package } from '@/types';
import { convertDataStringToObj } from '@/utils';

interface DataButtonProps {
  amount: string;
  selectedData: string;
  validDataOptions: string[];
  handleSelectData: (data: string) => void;
  isTiktokSupported: boolean;
  packages: Package[];
  selectedDay: number;
}

const DataButton = ({
  amount,
  selectedData,
  validDataOptions,
  handleSelectData,
  isTiktokSupported,
  packages,
  selectedDay,
}: DataButtonProps) => {
  const { t } = useTranslation();
  const isDataValid = selectedDay ? validDataOptions.includes(amount) : true;
  const { amount: dataAmount, unit } = convertDataStringToObj(amount, t);
  const supportTiktokCheck = !isTiktokSupported
    ? true
    : packages.some(
        (item: any) =>
          item.data_amount === dataAmount && item.data_unit === unit && item.tiktok === 'ENABLE'
      );
  const isValid = isDataValid && supportTiktokCheck;

  const baseClass = 'rounded-lg p-4';
  const selectedStyle = `${selectedData === amount ? 'bg-primary text-white' : 'bg-white'}`;
  const validStyle = `${!isValid ? 'cursor-not-allowed border-white/5 text-gray-300' : 'drop-shadow'}`;
  // const hoverStyle = `${selectedData !== amount && isValid ? 'hover:bg-primary/20' : ''}`;

  // const className = `${baseClass} ${selectedStyle} ${validStyle} ${hoverStyle}`;
  const className = `${baseClass} ${selectedStyle} ${validStyle}`;

  return (
    <Pressable className={className} key={amount} onPress={() => handleSelectData(amount)}>
      <Text className="text-center text-xs font-semibold text-inherit">
        {amount === '0GB' ? capitalize(t('unlimited')) : amount}
      </Text>
    </Pressable>
  );
};

export default DataButton;
