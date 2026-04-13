import { Pressable, Text, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce, capitalize } from 'lodash';
import { delay } from '@/utils';
import { Stack, useRouter } from 'expo-router';
import { Country } from '@/types';
import { filterCountry } from '@/utils/filterHelper';
// import LanguageSelector from '@/components/home/LanguageSelector';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import { SearchActionSheet } from '@/components/SearchActionSheet';
import NoResult from '@/components/home/NoResult';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useGlobalDataContext } from '../_layout';
import ListCountryRegion from '@/components/ListCountryRegion';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // const [isOpenLangSelector, setOpenLangSelector] = useState(false);
  const [isOpenSearch, setOpenSearch] = useState(false);

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

  // const debouncedSearch = debounce(fetchData, 500);

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
        <View className="flex-1 flex-row items-center gap-2">
          <Pressable
            onPress={() => setOpenSearch(() => true)}
            className="flex-1 flex-row items-center justify-between rounded-full bg-white px-4 py-3 drop-shadow">
            <Text className="text-gray-400">{`${capitalize(t('search'))} ${t('country')}/${t('region')}...`}</Text>

            <MagnifyingGlassIcon className="h-5 w-5 text-primary" />
          </Pressable>

          <View className="flex-row items-center gap-1 rounded-full border border-gray-200 bg-primary/10 px-4 py-1.5 drop-shadow">
            <InformationCircleIcon className="h-5 w-5 text-primary" />
            <Text className="text-xs text-primary">Kiểm tra</Text>
          </View>
        </View>

        {/* <LanguageSelector open={isOpenLangSelector} setOpen={setOpenLangSelector} /> */}
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

      {loading ? (
        <View className="flex-1 justify-center">
          <Text className="text-lg">{capitalize(t('loading'))}...</Text>
        </View>
      ) : listData.length === 0 ? (
        <NoResult />
      ) : (
        <ListCountryRegion data={listData} handlePress={handlePress} />
      )}

      <SearchActionSheet visible={isOpenSearch} onClose={() => setOpenSearch(false)} />
    </View>
  );
}
