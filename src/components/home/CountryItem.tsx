import { Country } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';
import { FlagImage } from '../FlagImage';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { Pressable, View, Text, DimensionValue } from 'react-native';

const CountryItem = ({
  item,
  numOfColumn,
  handlePress,
}: {
  item: Country;
  numOfColumn: number;
  handlePress: (id: number) => void;
}) => {
  const { t } = useTranslation();
  const { format, isEnglish } = useCurrency();

  const name = isEnglish ? item.nameLocation : item.nameVi;
  const price = isEnglish ? item.fromPriceUsd : item.fromPrice;
  const formatted = format(Number(price));

  return (
    <Pressable
      style={{ width: `calc(100% / ${numOfColumn})` as DimensionValue }}
      onPress={() => handlePress(item.locationId)}
      className="h-24 flex-1 flex-row overflow-hidden rounded-lg bg-white px-3 py-3.5 drop-shadow-md">
      <View className="flex-1 justify-between">
        <Text className="font-semibold text-primary">{name}</Text>
        <Text>
          {`${capitalize(t('from'))}: `}
          <Text className="text-lg font-bold">{formatted}</Text>
        </Text>
      </View>
      <View className="absolute -bottom-2 -right-2 h-12 w-12 overflow-hidden rounded-full border-2 border-gray-100">
        <FlagImage country={item} className="h-full w-full" />
      </View>
    </Pressable>
  );
};

export default CountryItem;
