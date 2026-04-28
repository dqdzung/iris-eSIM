import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useGlobalDataContext } from '../_layout';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { delay, formatCurrency } from '@/utils';
import { filterCountry } from '@/utils/filterHelper';
import { Country } from '@/types';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import NavHeader from '@/components/NavHeader';

const DisplayAllScreen = () => {
  const router = useRouter();
  const { i18n, t } = useTranslation();

  const { regions, countryAndRegion, uniqueCountries } = useGlobalDataContext();

  const inputRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState<Country[]>([]);

  const handlePress = useCallback((id: string) => router.push(`/detail/${id}`), [router]);

  const fetchData = useCallback(
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

  const debouncedSearch = debounce(fetchData, 500);

  const handleSearch = (value: string) => {
    if (!value) {
      fetchData();
      return;
    }
    const trimmed = value.trim().toLocaleLowerCase();
    debouncedSearch(trimmed);
  };

  const handleClearInput = () => {
    if (!inputRef.current || !inputRef.current.value) return;
    inputRef.current.clear();
    fetchData();
    inputRef.current.focus();
  };

  const renderListItem = useCallback(
    ({ item }: { item: Country }) => {
      if (!item) return null;

      const isEnglish = i18n.language === 'en-US';
      const name = isEnglish ? item?.name : item.name_vi;
      const price = isEnglish ? item.from_price_usd : item.from_price;
      const formatted = formatCurrency(price, i18n.language, isEnglish ? 'USD' : 'VND');
      const img = item.icon;

      return (
        <Pressable
          onPress={() => handlePress(item.id)}
          className="w-full flex-row overflow-hidden rounded-lg p-1 hover:text-primary hover:drop-shadow-md">
          <View className="flex-1 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-5 w-5 overflow-hidden rounded-full border-2 border-gray-100">
                <Image source={img} className="h-full w-full" />
              </View>

              <Text className="font-medium text-inherit">{name}</Text>
            </View>
            <Text className="text-[10px] capitalize">
              {`${t('from')}: `}
              <Text className="text-sm font-bold">{formatted}</Text>
            </Text>
          </View>
        </Pressable>
      );
    },
    [handlePress, i18n.language, t]
  );

  useEffect(() => {
    inputRef.current.focus();
    fetchData();
  }, [fetchData]);

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <NavHeader>
        <View className="flex-1 flex-row items-center justify-between rounded-full bg-white px-4 py-0.5 shadow-md shadow-primary/50">
          <View className="flex-1 flex-row items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5 stroke-2 font-bold text-primary" />
            <TextInput
              ref={inputRef}
              keyboardType="web-search"
              className="w-full px-1 py-2 text-xs outline-none"
              placeholder="Quốc gia - Khu vực"
              onChangeText={handleSearch}
            />
          </View>
          {inputRef.current?.value ? (
            <Pressable onPress={handleClearInput} className="flex-row items-center gap-2">
              <XMarkIcon className="h-5 w-5 text-red-500" />
            </Pressable>
          ) : null}
        </View>
      </NavHeader>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="capitalize">{t('loading')}...</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="p-4 gap-5">
          {inputRef.current?.value ? (
            <View className="gap-2">
              <Text className="text-[16px] font-semibold text-primary">Kết quả tìm kiếm</Text>

              {listData.length === 0 ? (
                <View className="flex-1">
                  <Text className="">
                    Không có kết quả nào phù hợp với từ khoá &quot;
                    <Text className="font-semibold">{inputRef.current.value}</Text>&quot;. Vui lòng
                    thử với từ khoá khác.
                  </Text>
                </View>
              ) : (
                <FlatList
                  className="w-full"
                  contentContainerClassName="gap-2"
                  keyExtractor={(item) => item.id}
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
                <Text className="text-[16px] font-semibold text-primary">Khu vực</Text>
                <FlatList
                  className="w-full"
                  contentContainerClassName="gap-2"
                  keyExtractor={(item) => item.id}
                  numColumns={1}
                  data={regions as Country[]}
                  renderItem={renderListItem}
                  showsVerticalScrollIndicator={false}
                />
              </View>

              <View className="gap-2">
                <Text className="text-[16px] font-semibold text-primary">Quốc gia</Text>
                <FlatList
                  className="w-full"
                  contentContainerClassName="gap-2"
                  keyExtractor={(item) => item.id}
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
