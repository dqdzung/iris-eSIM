import { Country } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';
import { FlagImage } from './FlagImage';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

type Props = {
  country: Country;
  onPress: (id: number) => void;
  variant: 'grid' | 'row';
  style?: StyleProp<ViewStyle>;
};

const CountryCard = ({ country, onPress, variant, style }: Props) => {
  const { t } = useTranslation();
  const { format, isEnglish } = useCurrency();

  const name = isEnglish ? country.nameLocation : country.nameVi;
  const price = isEnglish ? country.fromPriceUsd : country.fromPrice;
  const formatted = format(Number(price));

  if (variant === 'grid') {
    return (
      <Pressable
        style={style}
        onPress={() => onPress(country.locationId)}
        className="h-24 flex-1 flex-row overflow-hidden rounded-lg bg-white px-3 py-3.5 drop-shadow-md">
        <View className="flex-1 justify-between">
          <Text className="font-semibold text-primary">{name}</Text>
          <Text>
            {`${capitalize(t('from'))}: `}
            <Text className="text-lg font-bold">{formatted}</Text>
          </Text>
        </View>
        <View className="absolute -bottom-2 -right-2 h-12 w-12 overflow-hidden rounded-full border-2 border-gray-100">
          <FlagImage country={country} className="h-full w-full" />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={style}
      onPress={() => onPress(country.locationId)}
      className="w-full flex-row overflow-hidden rounded-lg p-1 hover:text-primary hover:drop-shadow-md">
      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-5 w-5 overflow-hidden rounded-full border-2 border-gray-100 bg-white">
            <FlagImage country={country} className="h-full w-full" />
          </View>
          <Text className="font-medium text-inherit">{name}</Text>
        </View>
        <Text className="text-xxs">
          {`${capitalize(t('from'))}: `}
          <Text className="text-sm font-bold">{formatted}</Text>
        </Text>
      </View>
    </Pressable>
  );
};

export default CountryCard;
