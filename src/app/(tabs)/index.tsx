import {
  DimensionValue,
  FlatList,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { debounce, capitalize } from 'lodash';
import { delay, formatCurrency } from '@/utils';
import { Stack, useRouter } from 'expo-router';
import { Country } from '@/types';
import { filterCountry } from '@/utils/countryHelper';
import { useGlobalDataContext } from '../_layout';
import LanguageSelector from '@/components/home/LanguageSelector';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import { SearchActionSheet } from '@/components/detail/SearchActionSheet';

export default function HomeScreen() {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [isOpenLangSelector, setOpenLangSelector] = useState(false);
  const [isOpenSearch, setOpenSearch] = useState(false);

  const { regions, uniqueCountries } = useGlobalDataContext();

  const inputRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'country' | 'region'>('country');
  const [listData, setListData] = useState<Country[]>([]);

  const numOfColumn = useMemo(() => {
    if (width <= 768) return 2;
    if (width > 768 && width <= 1024) return 3;
    if (width > 1024) return 4;
  }, [width]);

  const fetchData = useCallback(
    async (searchTerm?: string) => {
      if (searchTerm) {
        setLoading(true);
        await delay(300);
        setLoading(false);
      }
      const res = filterCountry(filterType === 'country' ? uniqueCountries : regions, searchTerm);
      setListData(res);
    },
    [filterType, regions, uniqueCountries]
  );

  const debouncedSearch = debounce(fetchData, 500);

  // const handleSearch = (value: string) => {
  //   if (!value) {
  //     fetchData();
  //     return;
  //   }
  //   const trimmed = value.trim().toLocaleLowerCase();
  //   debouncedSearch(trimmed);
  // };

  const handlePress = useCallback((id: string) => router.push(`/detail/${id}`), [router]);

  const handleChangeFilter = (type: string) => {
    if (inputRef.current?.value) {
      inputRef.current?.blur?.();
      inputRef.current.value = '';
    }
    setFilterType(type as any);
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
          style={{ maxWidth: `calc(100% / ${numOfColumn})` as DimensionValue }}
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
    },
    [handlePress, i18n.language, numOfColumn, t]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <View className="flex-1 items-center justify-center gap-2 px-4">
      <Stack.Screen
        options={{
          headerShown: false,
          // header: () => (
          //   <View className="flex-row justify-between bg-white p-4">
          //     <View className="h-10 w-[90px]">
          //       <Image
          //         source={require('../../../assets/iris-logo.png')}
          //         alt="iris-logo"
          //         className="h-full w-full object-cover"
          //       />
          //     </View>

          //     <Pressable className="cursor-pointer" onPress={() => setOpen(true)}>
          //       <View className="h-8 w-8 rounded-full">
          //         <Image
          //           source={currentLang.flagSrc}
          //           alt={`${t(currentLang.name)} flag`}
          //           className="h-full w-full object-cover"
          //         />
          //       </View>
          //     </Pressable>

          //     <LanguageActionSheet visible={isOpen} onClose={() => setOpen(false)} />
          //   </View>
          // ),
        }}
      />

      <View className="mt-4 w-full flex-row items-center justify-between gap-2">
        {/* <TextInput
          className="flex-1 mb-2 text-md rounded-full bg-white px-4 py-2 shadow-sm outline-none"
          ref={inputRef}
          keyboardType="web-search"
          placeholder={`${capitalize(t('search'))} ${t('country')}/${t('region')}...`}
          onChangeText={handleSearch}
        /> */}
        <Pressable
          onPress={() => setOpenSearch(() => true)}
          className="flex-1 flex-row items-center justify-between rounded-full bg-white px-4 py-2 shadow-sm">
          <Text className="text-gray-400">{`${capitalize(t('search'))} ${t('country')}/${t('region')}...`}</Text>

          <MagnifyingGlassIcon className="h-5 w-5 text-primary" />
        </Pressable>

        <LanguageSelector open={isOpenLangSelector} setOpen={setOpenLangSelector} />
      </View>

      <View className="w-full flex-row justify-center gap-2">
        {['country', 'region'].map((type) => (
          <Text
            key={type}
            onPress={() => handleChangeFilter(type)}
            className={`flex-1 rounded-sm border-b-4 border-transparent px-4 py-2 text-center capitalize text-gray-400 ${filterType === type ? 'border-b-primary font-semibold text-primary' : ''}`}>
            {t(type)}
          </Text>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 justify-center">
          <Text className="text-lg">{capitalize(t('loading'))}...</Text>
        </View>
      ) : listData.length === 0 ? (
        <View className="flex-1 justify-center">
          <Text className="text-lg italic">{capitalize(t('no_result'))}</Text>
        </View>
      ) : (
        <FlatList
          className="w-full py-2"
          columnWrapperClassName="gap-2"
          contentContainerClassName="gap-2"
          key={numOfColumn}
          keyExtractor={(item) => item.id}
          numColumns={numOfColumn}
          data={listData}
          renderItem={renderListItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      <SearchActionSheet visible={isOpenSearch} onClose={() => setOpenSearch(false)} />
    </View>
  );
}
