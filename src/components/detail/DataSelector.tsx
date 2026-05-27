import { View, Text, Switch } from 'react-native';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import DataButton from './DataButton';
import { Database } from 'lucide-react';

interface DataSelectorProps {
  selectedData: string;
  validDataOptions: string[];
  handleSelectData: (data: string) => void;
  isTiktokSupported: boolean;
  handleToggle: () => void;
  selectedDay: number;
}

const DataSelector = ({
  selectedData,
  validDataOptions,
  handleSelectData,
  isTiktokSupported,
  handleToggle,
  selectedDay,
}: DataSelectorProps) => {
  const { t } = useTranslation();

  if (!selectedDay) return null;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {/* <Database className="h-5 w-5 text-primary" /> */}
          <Text className="font-semibold text-primary">{capitalize(t('data'))}</Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Text className="italic text-gray-400">{capitalize(t('support'))}: </Text>
          <Image className="h-5 w-5" source={require('@assets/tiktok-logo.png')} />

          <Switch
            // @ts-expect-error
            activeThumbColor="white"
            trackColor={{ false: 'gray', true: Colors.primary }}
            value={isTiktokSupported}
            onValueChange={handleToggle}
          />
        </View>
      </View>

      <View className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {validDataOptions.map((amount) => (
          <DataButton
            key={amount}
            amount={amount}
            selectedData={selectedData}
            handleSelectData={handleSelectData}
          />
        ))}
      </View>
    </View>
  );
};

export default DataSelector;
