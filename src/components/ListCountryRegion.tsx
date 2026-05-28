import { Country } from '@/types';
import React, { useCallback, useMemo } from 'react';
import { DimensionValue, FlatList, useWindowDimensions } from 'react-native';
import CountryCard from './CountryCard';

const ListCountryRegion = ({
  handlePress,
  data,
}: {
  handlePress: (id: number) => void;
  data: Country[];
}) => {
  const { width } = useWindowDimensions();

  const numOfColumn = useMemo(() => {
    if (width <= 768) return 2;
    if (width > 768 && width <= 1024) return 3;
    if (width > 1024) return 4;
  }, [width]);

  const renderListItem = useCallback(
    ({ item }: { item: Country }) =>
      item ? (
        <CountryCard
          country={item}
          variant="grid"
          onPress={handlePress}
          style={{ maxWidth: `calc(100% / ${numOfColumn})` as DimensionValue }}
        />
      ) : null,
    [handlePress, numOfColumn]
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
