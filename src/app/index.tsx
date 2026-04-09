import { Pressable, Text, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { delay } from '@/utils';
import { Stack, useRouter } from 'expo-router';
import { Country } from '@/types';
import { filterCountry } from '@/utils/filterHelper';
import { useGlobalDataContext } from './_layout';
import NoResult from '@/components/home/NoResult';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import SearchCountryInput from '@/components/SearchCountryInput';
import ListCountryRegion from '@/components/ListCountryRegion';
import CompatibilityButton from '@/components/CompatibilityButton';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const { popularCountries, popularRegions } = useGlobalDataContext();

  const inputRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'country' | 'region'>('country');
  const [listData, setListData] = useState<Country[]>([]);

  const fetchData = useCallback(
    async (searchTerm?: string) => {
      if (searchTerm) {
        setLoading(true);
        await delay(300);
        setLoading(false);
      }
      const list = filterType === 'country' ? popularCountries : popularRegions;
      const res = filterCountry(list, searchTerm);
      setListData(res);
    },
    [filterType, popularCountries, popularRegions]
  );

  const handlePress = useCallback((id: string) => router.push(`/detail/${id}`), [router]);

  const handleChangeFilter = (type: string) => {
    if (inputRef.current?.value) {
      inputRef.current?.blur?.();
      inputRef.current.value = '';
    }
    setFilterType(type as any);
  };

  const handleClickAll = () => {
    router.push(`/all`);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <View className="flex-1 items-center justify-center gap-2 px-4">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="mt-4 w-full flex-row items-center justify-between gap-2">
        <View className="flex-1 flex-row items-center gap-2">
          <CompatibilityButton />

          <SearchCountryInput />
        </View>
      </View>

      <View className="w-full flex-row justify-center gap-2">
        {['country', 'region'].map((type) => (
          <Text
            key={type}
            onPress={() => handleChangeFilter(type)}
            className={`flex-1 rounded-sm border-b-4 border-transparent px-4 py-3 text-center capitalize text-gray-400 ${filterType === type ? 'border-b-primary font-semibold text-primary' : ''}`}>
            {t(type)}
          </Text>
        ))}
      </View>

      <View className="mt-3 w-full flex-row justify-between">
        <Text className="font-semibold text-primary">Phổ biến</Text>
        <Pressable className="flex-row items-center gap-1" onPress={handleClickAll}>
          <Text className="text-xs text-primary">Tất cả</Text>
          <ChevronLeftIcon className="h-3 w-3 rotate-180 stroke-2 text-primary" />
        </Pressable>
      </View>

      {loading ? (
        <View className="flex-1 justify-center">
          <Text className="text-lg">{capitalize(t('loading'))}...</Text>
        </View>
      ) : listData.length === 0 ? (
        <NoResult />
      ) : (
        <ListCountryRegion data={listData} handlePress={handlePress} />
      )}
    </View>
  );
}
