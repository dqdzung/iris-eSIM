import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { capitalize, debounce } from 'lodash';
import { delay, formatCurrency } from '@/utils';
import { filterCountry } from '@/utils/filterHelper';
import { Country } from '@/types';
import { useGlobalDataContext } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const SearchActionSheet = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { i18n, t } = useTranslation();
  const router = useRouter();

  const { countryAndRegion } = useGlobalDataContext();

  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [listData, setListData] = useState<Country[]>([]);

  const inputRef = useRef<any>(null);

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
    (id: string) => {
      router.push(`/detail/${id}`);
      onClose();
    },
    [onClose, router]
  );

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

              <Text className="text-inherit">{name}</Text>
            </View>
            <Text className="capitalize text-inherit">
              {`${t('from')}: `}
              <Text className="font-bold">{formatted}</Text>
            </Text>
          </View>
        </Pressable>
      );
    },
    [handlePress, i18n.language, t]
  );

  useEffect(() => {
    if (visible) {
      setTimeout(() => setIsAnimating(true), 10); // Small delay to trigger animation
      inputRef.current.focus(); // Focus on the input field when the modal opens
      fetchData();
    } else setIsAnimating(false);
  }, [fetchData, visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* opaque overlay */}
      <View
        className={`flex-1 bg-black/70 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
        {/* modal */}
        <View
          className={`mx-auto flex h-[90%] w-[90%] max-w-[500px] flex-col items-center gap-2 rounded-b-2xl bg-white p-4 shadow-lg transition-transform duration-300 ease-out ${
            isAnimating ? 'translate-y-0' : '-translate-y-full'
          }`}>
          <View className="w-full flex-row items-center justify-between capitalize">
            <View className="flex-row items-center gap-2">
              <MagnifyingGlassIcon className="h-5 w-5" />
              <Text className="font-semibold">{t('search')}</Text>
            </View>
            <Pressable onPress={onClose}>
              <XMarkIcon className="h-6 w-6" />
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
              <Text className="capitalize">{t('loading')}...</Text>
            </View>
          ) : listData.length === 0 ? (
            <View className="flex-1 justify-center">
              <Text className="capitalize italic">{t('no_result')}</Text>
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

        <TouchableOpacity onPress={onClose} className="w-full flex-1" />
      </View>
    </Modal>
  );
};
