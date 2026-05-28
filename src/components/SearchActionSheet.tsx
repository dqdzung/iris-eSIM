import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { capitalize, debounce } from 'lodash';
import { delay } from '@/utils';
import { filterCountry } from '@/utils/filterHelper';
import { Country } from '@/types';
import { useGlobalDataContext } from '@/hooks/useGlobalDataContext';
import { useRouter } from 'expo-router';
import CountryCard from './CountryCard';
import { ActionSheet } from './ActionSheet';
import { Search, X } from 'lucide-react';

export const SearchActionSheet = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { countryAndRegion } = useGlobalDataContext();

  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState<Country[]>([]);

  const inputRef = useRef<TextInput>(null);

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

  const handlePress = useCallback(
    (id: number) => {
      router.push(`/detail/${id}`);
      onClose();
    },
    [onClose, router]
  );

  const renderListItem = useCallback(
    ({ item }: { item: Country }) =>
      item ? <CountryCard country={item} variant="row" onPress={handlePress} /> : null,
    [handlePress]
  );

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
      fetchData();
    }
  }, [fetchData, visible]);

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      position="top"
      overlayClassName="bg-black/70"
      panelClassName="mx-auto h-[90%] w-[90%] max-w-[500px] items-center gap-2 rounded-b-2xl p-4">
      <View className="w-full flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Search className="h-5 w-5" />
          <Text className="font-semibold">{capitalize(t('search'))}</Text>
        </View>
        <Pressable onPress={onClose}>
          <X className="h-6 w-6" />
        </Pressable>
      </View>

      <TextInput
        ref={inputRef}
        keyboardType="web-search"
        className="text-md my-2 w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 outline-none"
        placeholder={`${capitalize(t('search'))} ${t('country')}/${t('region')}...`}
        onChangeText={handleSearch}
      />

      {loading ? (
        <View className="flex-1 justify-center">
          <Text>{capitalize(t('loading'))}...</Text>
        </View>
      ) : listData.length === 0 ? (
        <View className="flex-1 justify-center">
          <Text className="italic">{capitalize(t('no_result'))}</Text>
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
    </ActionSheet>
  );
};
