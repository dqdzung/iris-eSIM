import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { capitalize, debounce } from 'lodash';
import { delay } from '@/utils';
import { filterDevice } from '@/utils/filterHelper';
import { useGlobalDataContext } from '@/hooks/useGlobalDataContext';
import { DevicePhoneMobileIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Image } from 'expo-image';
import { ActionSheet } from './ActionSheet';

export const CompatibilityActionSheet = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();

  const { listDevice } = useGlobalDataContext();

  // const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState<any[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  const inputRef = useRef<TextInput & { value?: string }>(null);

  const getListCompatibleDevice = useCallback(
    async (searchTerm?: string) => {
      if (searchTerm) {
        // setLoading(true);
        await delay(300);
        // setLoading(false);
      }
      let res = filterDevice(listDevice, searchTerm);

      if (filter) {
        res = res.filter((item) => {
          if (filter === 'Khác') {
            return !['Apple', 'Samsung', 'Google'].includes(item.brand);
          }
          return item.brand === filter;
        });
      }

      setListData(res);
    },
    [listDevice, filter]
  );

  const debouncedSearch = debounce(getListCompatibleDevice, 500);

  const handleSearch = (value: string) => {
    if (!value) {
      getListCompatibleDevice();
      return;
    }
    const trimmed = value.trim().toLocaleLowerCase();
    setFilter(null);
    debouncedSearch(trimmed);
  };

  const handleClearInput = () => {
    if (!inputRef.current || !inputRef.current.value) return;
    inputRef.current.clear();
    getListCompatibleDevice();
    inputRef.current.focus();
  };

  const handleFilter = (brand: string) => {
    if (inputRef.current?.value) inputRef.current.clear();
    setFilter(brand);
  };

  const renderListItem = useCallback(({ item }: { item: { name: string; brand: string } }) => {
    if (!item) return null;

    return (
      <View className="flex-row items-center gap-2">
        <DevicePhoneMobileIcon className="h-6 w-6 text-primary" />

        <View className="flex-col gap-1">
          <Text className="font-semibold">{item.name}</Text>
          <Text className="text-xs text-gray-400">{item.brand}</Text>
        </View>
      </View>
    );
  }, []);

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
      getListCompatibleDevice();
    }
  }, [getListCompatibleDevice, visible]);

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      overlayClassName="bg-black/30 items-center"
      panelClassName="w-full gap-5 rounded-t-2xl px-5 py-4">
      <View className="relative w-full flex-row items-center justify-between">
        <View />

        <Text className="px-20 text-center text-[16px] font-semibold capitalize leading-6">
          {t('nav.compatibility_devices')}
        </Text>

        <Pressable onPress={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </Pressable>
      </View>

      <View className="gap-5">
        <Text className="font-semibold">{capitalize(t('compatibility_sheet.instruction'))}</Text>

        <View>
          <Text>- {capitalize(t('compatibility_sheet.eid_yes'))}</Text>
          <Text>- {capitalize(t('compatibility_sheet.eid_no'))}</Text>
        </View>

        <View className="flex-row flex-wrap items-center gap-1">
          {['Apple', 'Samsung', 'Google', 'Khác'].map((brand) => (
            <Pressable
              key={brand}
              onPress={() => handleFilter(brand)}
              className={`flex-1 rounded-full py-2 ${filter === brand ? 'bg-primary' : 'bg-white'} border border-gray-200`}>
              <Text className={`text-center ${filter === brand ? 'text-white' : ''}`}>
                {brand === 'Khác' ? capitalize(t('compatibility_sheet.other_brand')) : brand}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="">
        <View className="-top-8 items-center">
          <Image
            source={require('@assets/device.png')}
            className="-bottom-8 h-[120px] w-[120px]"
          />
          <View className="w-full flex-row items-center justify-between rounded-full bg-white px-4 py-3 shadow-md shadow-primary/50">
            <View className="flex-row gap-2">
              <MagnifyingGlassIcon className="h-5 w-5 stroke-2 text-primary" />
              <TextInput
                ref={inputRef}
                keyboardType="web-search"
                className="text-md w-full px-1 outline-none"
                placeholder={capitalize(t('compatibility_sheet.search_placeholder'))}
                onChangeText={handleSearch}
              />
            </View>
            {inputRef.current?.value ? (
              <Pressable onPress={handleClearInput} className="flex-row items-center gap-2">
                <XMarkIcon className="h-5 w-5 text-red-500" />
              </Pressable>
            ) : null}
          </View>
        </View>

        <Text className="-mt-3 mb-4 text-xs italic text-primary">
          {capitalize(t('compatibility_sheet.warning'))}
        </Text>

        {inputRef.current?.value && listData.length === 0 ? (
          <View className="h-96 items-center py-10">
            <Text className="italic">
              {capitalize(
                t('compatibility_sheet.not_supported', {
                  name: `"${inputRef.current.value}"`,
                })
              )}
            </Text>
          </View>
        ) : (
          <FlatList
            className="h-96"
            contentContainerClassName="gap-2.5"
            keyExtractor={(item) => item.name}
            numColumns={1}
            data={listData}
            renderItem={renderListItem}
          />
        )}
      </View>
    </ActionSheet>
  );
};
