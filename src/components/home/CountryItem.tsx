import { Country } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';
import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const img = item.icon;

  return (
    <Pressable
      style={{ width: `calc(100% / ${numOfColumn})` as DimensionValue }}
      onPress={() => handlePress(item.locationId)}
      className="h-24 flex-1 flex-row overflow-hidden rounded-lg bg-white px-3 py-3.5 drop-shadow-md">
      <View className="flex-1 justify-between">
        <Text className="font-semibold text-primary">{name}</Text>
        <Text className="capitalize">
          {`${t('from')}: `}
          <Text className="text-lg font-bold">{formatted}</Text>
        </Text>
      </View>
      <View className="absolute -bottom-2 -right-2 h-12 w-12 overflow-hidden rounded-full border-2 border-gray-100">
        <Image source={img} className="h-full w-full" />
      </View>
    </Pressable>
  );
};

export default CountryItem;
