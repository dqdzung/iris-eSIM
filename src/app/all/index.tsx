import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { delay } from '@/utils';
import { filterCountry } from '@/utils/filterHelper';
import { Country } from '@/types';
import CountryCard from '@/components/CountryCard';
import { useTranslation } from 'react-i18next';
import { capitalize, debounce } from 'lodash';
import LoadingOverlay from '@/components/LoadingOverlay';
import NavHeader from '@/components/NavHeader';
import { useGlobalDataContext } from '@/hooks/useGlobalDataContext';
import { Search, X } from 'lucide-react';

const DisplayAllScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    regions,
    countryAndRegion,
    uniqueCountries,
    loading: bootLoading,
  } = useGlobalDataContext();

  const inputRef = useRef<TextInput & { value?: string }>(null);

  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState<Country[]>([]);

  const handlePress = useCallback((id: number) => router.push(`/detail/${id}`), [router]);

  const filterData = useCallback(
    async (searchTerm?: string) => {
      if (searchTerm) {
        setLoading(true);
        await delay(300);
        setLoading(false);
      }
      const res = filterCountry(countryAndRegion, searchTerm);
      setListData(res);
    },
    [countryAndRegion]
  );

  const debouncedSearch = debounce(filterData, 500);

  const handleSearch = (value: string) => {
    if (!value) {
      filterData();
      return;
    }
    const trimmed = value.trim().toLocaleLowerCase();
    debouncedSearch(trimmed);
  };

  const handleClearInput = () => {
    if (!inputRef.current || !inputRef.current.value) return;
    inputRef.current.clear();
    filterData();
    inputRef.current.focus();
  };

  const renderListItem = useCallback(
    ({ item }: { item: Country }) =>
      item ? <CountryCard country={item} variant="row" onPress={handlePress} /> : null,
    [handlePress]
  );

  useEffect(() => {
    inputRef.current?.focus();
    filterData();
  }, [filterData]);

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <NavHeader>
        <View className="flex-1 flex-row items-center justify-between rounded-full bg-white px-4 py-0.5 shadow-md shadow-primary/50">
          <View className="flex-1 flex-row items-center gap-2">
            <Search className="h-5 w-5 stroke-2 font-bold text-primary" />
            <TextInput
              ref={inputRef}
              keyboardType="web-search"
              className="w-full px-1 py-2 text-xs outline-none"
              placeholder={t('country_region_placeholder')}
              onChangeText={handleSearch}
            />
          </View>
          {inputRef.current?.value ? (
            <Pressable onPress={handleClearInput} className="flex-row items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
            </Pressable>
          ) : null}
        </View>
      </NavHeader>

      <View className="relative flex-1">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text>{capitalize(t('loading'))}...</Text>
          </View>
        ) : (
          <ScrollView contentContainerClassName="p-4 gap-5">
            {inputRef.current?.value ? (
              <View className="gap-2">
                <Text className="text-base font-semibold text-primary">
                  {capitalize(t('all_screen.search_result'))}
                </Text>

                {listData.length === 0 ? (
                  <View className="flex-1">
                    <Text className="">
                      {capitalize(t('all_screen.no_result_prefix'))} &quot;
                      <Text className="font-semibold">{inputRef.current?.value}</Text>&quot;
                      {t('all_screen.no_result_suffix')}
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    className="w-full"
                    contentContainerClassName="gap-2"
                    keyExtractor={(item) => String(item.locationId)}
                    numColumns={1}
                    data={listData}
                    renderItem={renderListItem}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            ) : (
              <>
                <View className="gap-2">
                  <Text className="text-base font-semibold text-primary">
                    {capitalize(t('region'))}
                  </Text>
                  <FlatList
                    className="w-full"
                    contentContainerClassName="gap-2"
                    keyExtractor={(item) => String(item.locationId)}
                    numColumns={1}
                    data={regions as Country[]}
                    renderItem={renderListItem}
                    showsVerticalScrollIndicator={false}
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-base font-semibold text-primary">
                    {capitalize(t('country'))}
                  </Text>
                  <FlatList
                    className="w-full"
                    contentContainerClassName="gap-2"
                    keyExtractor={(item) => String(item.locationId)}
                    numColumns={1}
                    data={uniqueCountries as Country[]}
                    renderItem={renderListItem}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </>
            )}
          </ScrollView>
        )}

        <LoadingOverlay isVisible={bootLoading} />
      </View>

      {/* <ScrollView contentContainerClassName="gap-5 px-4 pb-4">
        <View>
          <Text className="font-semibold text-primary">Khu vực</Text>
          <ListCountryRegion data={regions} handlePress={handlePress} />
        </View>

        {regions.map((region) => {
          if (!region.countries.length) return null;
          return (
            <View key={region.id}>
              <Text className="font-semibold text-primary">{region.name_vi}</Text>
              <ListCountryRegion data={region.countries} handlePress={handlePress} />
            </View>
          );
        })}
      </ScrollView> */}
    </View>
  );
};

export default DisplayAllScreen;
