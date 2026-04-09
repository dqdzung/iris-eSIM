import { Country } from '@/types';
import { formatCurrency } from '@/utils';
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
  handlePress: (id: string) => void;
}) => {
  const { i18n, t } = useTranslation();

  const isEnglish = i18n.language === 'en-US';
  const name = isEnglish ? item?.name : item.name_vi;
  const price = isEnglish ? item.from_price_usd : item.from_price;
  const formatted = formatCurrency(price, i18n.language, isEnglish ? 'USD' : 'VND');
  const img = item.icon;

  return (
    <Pressable
      style={{ width: `calc(100% / ${numOfColumn})` as DimensionValue }}
      onPress={() => handlePress(item.id)}
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
