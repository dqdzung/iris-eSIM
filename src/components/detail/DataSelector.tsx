import { View, Text } from 'react-native';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import IosSwitch from '../IosSwitch';
import SelectableChip from './SelectableChip';

interface DataSelectorProps {
  selectedData: string;
  validDataOptions: string[];
  isTiktokSupported: boolean;
  tiktokToggleDisabled: boolean;
  selectedDay: number;
  handleToggle: () => void;
  handleSelectData: (data: string) => void;
}

const DataSelector = ({
  selectedData,
  validDataOptions,
  isTiktokSupported,
  tiktokToggleDisabled,
  selectedDay,
  handleToggle,
  handleSelectData,
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

        <View className="flex-row items-center gap-3">
          <Text className="text-gray-400">{capitalize(t('support'))}: </Text>
          <Image className="h-6 w-6" source={require('@assets/tiktok-logo.png')} />

          <IosSwitch
            value={isTiktokSupported}
            onValueChange={handleToggle}
            disabled={tiktokToggleDisabled}
          />
        </View>
      </View>

      <View className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
        {validDataOptions.map((amount) => (
          <SelectableChip
            key={amount}
            label={amount === '0GB' ? capitalize(t('unlimited')) : amount}
            selected={selectedData === amount}
            onPress={() => handleSelectData(amount)}
          />
        ))}
      </View>
    </View>
  );
};

export default DataSelector;
