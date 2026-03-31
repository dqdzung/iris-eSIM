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

export default function HomeScreen() {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [isOpen, setOpen] = useState(false);

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

  const handleSearch = (value: string) => {
    if (!value) {
      fetchData();
      return;
    }
    const trimmed = value.trim().toLocaleLowerCase();
    debouncedSearch(trimmed);
  };

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
          className="h-24 flex-1 flex-row overflow-hidden rounded-lg border-2 border-gray-100 bg-gray-50 p-2 hover:drop-shadow-md">
          <View className="flex-1 justify-between">
            <Text className="font-semibold">{name}</Text>
            <Text className="font-semibold capitalize">
              {`${t('from')}: `}
              <Text className="text-lg font-bold">{formatted}</Text>
            </Text>
          </View>
          <View className="absolute -bottom-1.5 -right-1.5 h-12 w-12 overflow-hidden rounded-full border-2 border-gray-100">
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
    <View className="flex-1 items-center justify-center gap-2 bg-white px-4">
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
      <TextInput
        ref={inputRef}
        keyboardType="web-search"
        className="text-md my-2 w-full rounded-lg border border-gray-200 px-4 py-2 outline-none"
        placeholder={`${capitalize(t('search'))}...`}
        onChangeText={handleSearch}
      />

      <LanguageSelector open={isOpen} setOpen={setOpen} />

      <View className="w-full flex-row justify-center gap-2">
        {['country', 'region'].map((type) => (
          <Text
            key={type}
            onPress={() => handleChangeFilter(type)}
            className={`w-[25%] max-w-[100px] rounded-lg border border-gray-200 px-4 py-2 text-center capitalize ${filterType === type ? 'bg-primary' : ''} ${filterType === type ? 'text-white' : ''}`}>
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
    </View>
  );
}
