import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { capitalize, debounce } from 'lodash';
import { delay } from '@/utils';
import { filterDevice } from '@/utils/filterHelper';
import { useGlobalDataContext } from '@/app/_layout';
import { DevicePhoneMobileIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const CompatibilityActionSheet = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();

  const { listDevice } = useGlobalDataContext();

  const [isAnimating, setIsAnimating] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState<any[]>([]);

  const inputRef = useRef<any>(null);

  const getListCompatibleDevice = useCallback(
    async (searchTerm?: string) => {
      if (searchTerm) {
        // setLoading(true);
        await delay(300);
        // setLoading(false);
      }
      const res = filterDevice(listDevice, searchTerm);
      setListData(res);
    },
    [listDevice]
  );

  const debouncedSearch = debounce(getListCompatibleDevice, 500);

  const handleSearch = (value: string) => {
    if (!value) {
      getListCompatibleDevice();

      return;
    }
    const trimmed = value.trim().toLocaleLowerCase();
    debouncedSearch(trimmed);
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
      setTimeout(() => setIsAnimating(true), 10); // Small delay to trigger animation
      inputRef.current.focus(); // Focus on the input field when the modal opens
      getListCompatibleDevice();
    } else setIsAnimating(false);
  }, [getListCompatibleDevice, visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* opaque overlay */}
      <View
        className={`flex-1 items-center bg-black/30 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
        {/* touch overlay to close */}
        <TouchableOpacity onPress={onClose} className="w-full flex-1" />
        {/* modal */}
        <View
          className={`flex w-full flex-col gap-5 rounded-t-2xl bg-white px-5 py-4 shadow-lg transition-transform duration-300 ease-out ${
            isAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}>
          <View className="relative w-full flex-row items-center justify-between">
            <View />

            <Text className="px-20 text-center text-[16px] font-semibold leading-6">
              Kiểm tra xem điện thoại của Quý khách có hỗ trợ eSIM không?
            </Text>

            <Pressable onPress={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </Pressable>
          </View>

          <Text className="italic text-red-500">
            Lưu ý: Vui lòng đảm bảo thiết bị của Quý khách hỗ trợ eSIM trước khi mua. Các thông tin
            để kiểm tra dưới đây chỉ mang tính chất tham khảo.
          </Text>

          <View className="gap-2">
            <Text className="font-semibold">
              Để kiểm tra thiết bị có hỗ trợ eSIM không, ấn *#06# trên bàn phím, ấn gọi:
            </Text>

            <View>
              <Text>- Màn hình hiện EID: có hỗ trợ eSIM</Text>
              <Text>- Màn hình không hiện EID: không hỗ trợ eSIM.</Text>
            </View>
          </View>

          <View className="gap-2.5">
            <Text className="font-semibold">Hoặc tìm nhanh ở danh sách dưới đây:</Text>

            <View className="flex-1 flex-row items-center justify-between gap-2 rounded-full bg-white px-4 py-3.5 drop-shadow">
              <TextInput
                ref={inputRef}
                keyboardType="web-search"
                className="text-md w-full px-1 outline-none"
                placeholder={`${capitalize(t('search'))} thiết bị`}
                onChangeText={handleSearch}
              />
              <MagnifyingGlassIcon className="h-5 w-5 stroke-2 text-primary" />
            </View>

            {inputRef.current?.value && listData.length === 0 ? (
              <View className="h-auto items-center py-10">
                <Text className="italic">{`"${inputRef.current.value}" không hỗ trợ eSIM`}</Text>
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
        </View>
      </View>
    </Modal>
  );
};
