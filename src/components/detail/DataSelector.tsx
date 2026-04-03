import { View, Text, Switch } from 'react-native';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { Package } from '@/types';
import DataButton from './DataButton';

interface DataSelectorProps {
  dataOptions: string[];
  selectedData: string;
  validDataOptions: string[];
  handleSelectData: (data: string) => void;
  isTiktokSupported: boolean;
  handleToggle: () => void;
  packages: Package[];
  selectedDay: number;
}

const DataSelector = (props: DataSelectorProps) => {
  const { t } = useTranslation();
  const { dataOptions, isTiktokSupported, handleToggle } = props;

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <CircleStackIcon className="h-5 w-5 text-primary" />
          <Text className="font-semibold text-primary">Dung lượng</Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Text className="italic text-gray-400">{capitalize(t('support'))}: </Text>
          <Image className="h-5 w-5" source={require('../../../assets/tiktok-logo.png')} />

          <Switch
            //@ts-expect-error
            activeThumbColor="white"
            trackColor={{ false: 'gray', true: Colors.primary }}
            value={isTiktokSupported}
            onValueChange={handleToggle}
          />
        </View>
      </View>

      <View className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {dataOptions?.map((amount: string) => (
          <DataButton key={amount} amount={amount} {...props} />
        ))}
      </View>

      {/* for testing */}
      {/* {selectedPackage && (
        <View className="gap-4 rounded-lg border-2 border-gray-200 px-6 py-3 drop-shadow-sm">
          <Text>{JSON.stringify(selectedPackage)}</Text>
        </View>
      )} */}
    </View>
  );
};

export default DataSelector;
