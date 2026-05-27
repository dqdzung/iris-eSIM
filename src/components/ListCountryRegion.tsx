import { Country } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';
import { FlagImage } from './FlagImage';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { DimensionValue, FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native';

const ListCountryRegion = ({
  handlePress,
  data,
}: {
  handlePress: (id: number) => void;
  data: Country[];
}) => {
  const { t } = useTranslation();
  const { format, isEnglish } = useCurrency();

  const { width } = useWindowDimensions();

  const numOfColumn = useMemo(() => {
    if (width <= 768) return 2;
    if (width > 768 && width <= 1024) return 3;
    if (width > 1024) return 4;
  }, [width]);

  const renderListItem = useCallback(
    ({ item }: { item: Country }) => {
      if (!item) return null;

      const name = isEnglish ? item.nameLocation : item.nameVi;
      const price = isEnglish ? item.fromPriceUsd : item.fromPrice;
      const formatted = format(Number(price));

      return (
        <Pressable
          style={{ maxWidth: `calc(100% / ${numOfColumn})` as DimensionValue }}
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
    },
    [handlePress, isEnglish, format, numOfColumn, t]
  );

  return (
    <FlatList
      className="w-full py-2"
      columnWrapperClassName="gap-2"
      contentContainerClassName="gap-2"
      key={numOfColumn}
      keyExtractor={(item) => String(item.locationId)}
      numColumns={numOfColumn}
      data={data}
      renderItem={renderListItem}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ListCountryRegion;
