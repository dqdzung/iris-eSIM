import { Stack, useLocalSearchParams, usePathname } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CountryData } from '@/types';
import DaySelector from '@/components/detail/DaySelector';
import DataSelector from '@/components/detail/DataSelector';
import {
  formatCurrency,
  dataSortFunc,
  convertDataObjToString,
  convertDataStringToObj,
} from '@/utils';
import { fetchCountryData } from '@/api';
import { PurchaseActionSheet } from '@/components/detail/PurchaseActionSheet';
import { SearchActionSheet } from '@/components/SearchActionSheet';
import CompatibilityButton from '@/components/CompatibilityButton';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

export default function DetailScreen() {
  const { i18n, t } = useTranslation();
  const { id: countryId } = useLocalSearchParams<{ id: string }>();
  const path = usePathname();

  const [tab, setTab] = useState('spec');
  const [data, setData] = useState<CountryData>();
  const [selection, setSelection] = useState({
    selectedDay: 0,
    selectedData: '',
    isTiktokSupported: false,
  });
  const [isPurchaseSheetVisible, setPurchaseSheetVisible] = useState(false);
  const [isSearchSheetVisible, setSearchSheetVisible] = useState(false);

  const { selectedDay, selectedData, isTiktokSupported } = useMemo(() => {
    return {
      selectedDay: selection.selectedDay,
      selectedData: selection.selectedData,
      isTiktokSupported: selection.isTiktokSupported,
    };
  }, [selection]);

  const regionInfo = data?.region_info;
  const carriers = regionInfo?.carriers.join(', ') || '';

  const packages = useMemo(() => data?.packages || [], [data]);

  const name = useMemo(() => {
    if (!regionInfo) return '';
    const isEnglish = i18n.language === 'en-US';
    return isEnglish ? regionInfo?.name : regionInfo?.name_vi;
  }, [regionInfo, i18n.language]);

  const lowestPrice = useMemo(() => {
    if (packages.length === 0) return '';
    const isEnglish = i18n.language === 'en-US';
    const prices = packages.map((p) => (isEnglish ? p.selling_price_usd : p.selling_price));
    const minPrice = Math.min(...prices);
    return formatCurrency(minPrice, i18n.language, isEnglish ? 'USD' : 'VND');
  }, [packages, i18n.language]);

  const highestPrice = useMemo(() => {
    if (packages.length === 0) return '';
    const isEnglish = i18n.language === 'en-US';
    const prices = packages.map((p) => (isEnglish ? p.selling_price_usd : p.selling_price));
    const maxPrice = Math.max(...prices);
    return formatCurrency(maxPrice, i18n.language, isEnglish ? 'USD' : 'VND');
  }, [packages, i18n.language]);

  const dayOptions = useMemo(() => {
    const days = packages.map((p) => p.validity_days);
    return [...new Set(days)].sort((a, b) => a - b);
  }, [packages]);

  const dataOptions = useMemo(() => {
    const dataStrings = packages.map((p) => convertDataObjToString(p, t));
    return [...new Set(dataStrings)].sort((a, b) => dataSortFunc(a, b, t));
  }, [packages, t]);

  const validDayOptions = useMemo(() => {
    if (!selectedData) return dayOptions;
    const { amount, unit, isDaily } = convertDataStringToObj(selectedData, t);
    const filteredPackages = packages.filter(
      (p) =>
        p.data_amount === amount &&
        p.data_unit === unit &&
        (isDaily ? p.type === 'DAILY' : p.type !== 'DAILY') &&
        (isTiktokSupported ? p.tiktok === 'ENABLE' : true)
    );
    const days = filteredPackages.map((p) => p.validity_days);
    return [...new Set(days)];
  }, [packages, selectedData, dayOptions, isTiktokSupported, t]);

  const validDataOptions = useMemo(() => {
    if (!selectedDay) return dataOptions;
    const filteredPackages = packages.filter(
      (p) => p.validity_days === selectedDay && (isTiktokSupported ? p.tiktok === 'ENABLE' : true)
    );
    const dataStrings = filteredPackages.map((p) => convertDataObjToString(p, t));
    return [...new Set(dataStrings)];
  }, [packages, selectedDay, dataOptions, isTiktokSupported, t]);

  const selectedPackage = useMemo(() => {
    if (!selectedDay || !selectedData) return null;
    const { amount, unit, isDaily } = convertDataStringToObj(selectedData, t);
    const pkg = packages.find(
      (p) =>
        p.validity_days === selectedDay &&
        p.data_amount === amount &&
        p.data_unit === unit &&
        (isDaily ? p.type === 'DAILY' : p.type !== 'DAILY') &&
        (isTiktokSupported ? p.tiktok === 'ENABLE' : true)
    );
    return pkg;
  }, [packages, selectedDay, selectedData, isTiktokSupported, t]);

  const handleToggle = () => {
    setSelection((prev) => ({ ...prev, isTiktokSupported: !prev.isTiktokSupported }));
  };

  const handleSelectDay = useCallback(
    (day: number) => {
      setSelection((prev) => ({
        ...prev,
        selectedDay: day === prev.selectedDay ? 0 : day,
        selectedData:
          day !== prev.selectedDay && prev.selectedData && !validDayOptions.includes(day)
            ? ''
            : prev.selectedData,
      }));
    },
    [validDayOptions]
  );

  const handleSelectData = useCallback(
    (data: string) => {
      setSelection((prev) => ({
        ...prev,
        selectedData: data === prev.selectedData ? '' : data,
        selectedDay:
          data !== prev.selectedData && prev.selectedDay && !validDataOptions.includes(data)
            ? 0
            : prev.selectedDay,
      }));
    },
    [validDataOptions]
  );

  const handleChangeTab = (type: string) => {
    setTab(type);
  };

  useEffect(() => {
    if (countryId) {
      fetchCountryData(countryId).then(setData);
    }
  }, [countryId]);

  // open action sheet when select package
  // useEffect(() => {
  //   if (selectedPackage && !isPurchaseSheetVisible) {
  //     setPurchaseSheetVisible(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedPackage]);

  // reopen action sheet when backing from checkout
  useEffect(() => {
    if (!isPurchaseSheetVisible && selectedPackage && path === `/detail/${countryId}`) {
      setPurchaseSheetVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  if (!data || !regionInfo) return null;

  return (
    <ScrollView contentContainerClassName="p-4 gap-5">
      <Stack.Screen
        options={{
          title: 'Chi tiết',
          // headerRight: () => (
          //   <Pressable onPress={() => setSearchSheetVisible(true)}>
          //     <MagnifyingGlassIcon className="mr-4 h-6 w-6 text-white" />
          //   </Pressable>
          // ),
        }}
      />

      {/* <DetailHeader
        banner={regionInfo.banner}
        flag={regionInfo.flag}
        lowestPrice={lowestPrice}
        highestPrice={highestPrice}
        carriers={carriers}
        coverage={regionInfo?.coverage_area}
      /> */}

      <View className="flex-row items-center justify-between rounded-xl bg-white px-3 py-2 drop-shadow-sm">
        <View className="flex-row items-center gap-2">
          <View className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-100">
            <Image source={regionInfo.flag} className="h-full w-full" />
          </View>
          <Text className="text-lg font-medium">{name}</Text>
        </View>

        <CompatibilityButton />
      </View>

      <DaySelector
        dayOptions={dayOptions}
        selectedDay={selectedDay}
        validDayOptions={validDayOptions}
        handleSelectDay={handleSelectDay}
        isTiktokSupported={isTiktokSupported}
        packages={packages}
        selectedData={selectedData}
      />

      <DataSelector
        dataOptions={dataOptions}
        selectedData={selectedData}
        validDataOptions={validDataOptions}
        handleSelectData={handleSelectData}
        isTiktokSupported={isTiktokSupported}
        handleToggle={handleToggle}
        packages={packages}
        selectedDay={selectedDay}
      />

      {selectedPackage && (
        <>
          <View>
            <View className="w-full flex-row justify-center gap-2">
              {Object.keys(mock).map((key) => (
                <View key={key} className="flex-1">
                  <Text
                    onPress={() => handleChangeTab(key)}
                    className={`px-4 py-3 text-center text-gray-400 ${tab === key ? 'font-semibold text-primary' : ''}`}>
                    {key === 'spec' ? 'Thông số kỹ thuật' : 'Lưu ý'}
                  </Text>
                  <View className={`h-1 rounded-t-lg ${tab === key ? 'bg-primary' : ''}`} />
                </View>
              ))}
            </View>

            <View className="p-2">{(mock as any)?.[tab]}</View>
          </View>

          <LinearGradient
            className="rounded-xl drop-shadow-md"
            colors={['rgba(58, 89, 237, 1)', 'rgba(125, 68, 225, 1)']}>
            <Pressable onPress={() => setPurchaseSheetVisible(true)} className="px-10 py-3">
              <Text className="text-center font-semibold text-white">Mua ngay</Text>
            </Pressable>
          </LinearGradient>

          <PurchaseActionSheet
            selectedPackage={selectedPackage}
            visible={isPurchaseSheetVisible}
            onClose={() => setPurchaseSheetVisible(false)}
          />
        </>
      )}

      {isSearchSheetVisible && (
        <SearchActionSheet
          visible={isSearchSheetVisible}
          onClose={() => setSearchSheetVisible(false)}
        />
      )}
    </ScrollView>
  );
}

const notes = [
  'Nên cài đặt eSIM theo hướng dẫn trước khi bay (khi cài cần có internet), bật sẵn Data Roaming và chuyển sử dụng dữ liệu data sang eSIM Iris',
  'Chúng tôi khuyến khích khách mua nhiều hơn 01 ngày so với nhu cầu để tránh bị hết số ngày sử dụng do lệch múi giờ giữa các quốc gia.',
  'Mỗi eSIM chỉ kích hoạt được 1 lần. Nếu cần dùng lại, bạn phải liên hệ với InfiGate để cấp lại mã QR. Phí cấp lại eSIM là 25.000đ/lần.',
  'Chính sách bảo hành: \n+ Cam kết đổi trả hoặc hoàn tiền 100% nếu lỗi nhà cung cấp \n+ Đổi mới trong 1h khi gặp sự cố khi kích hoạt hoặc sử dụng',
];

const mock = {
  spec: (
    <Text className="text-xs">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. A quaerat mollitia dicta? Quidem
      doloremque numquam fuga, deleniti suscipit aliquam iure similique deserunt quos impedit,
      aperiam ipsam tempore harum laborum ab, molestias temporibus. Molestiae animi aliquid quod
      pariatur sint perferendis non, distinctio recusandae, esse quam omnis nobis quae nam ut
      tempore excepturi cumque alias. Ut eius totam facere doloribus rem quas vel. Mollitia ex
      aperiam cumque, recusandae atque deserunt? Ullam aperiam exercitationem architecto hic!
      Asperiores ad fugit provident officia ducimus aspernatur quasi minus harum vel unde mollitia
      rerum voluptatum ipsa quae, explicabo consequatur, voluptatibus iusto a at possimus illum
      beatae dolor.
    </Text>
  ),
  note: (
    <View className="flex-col gap-2">
      {notes.map((note, index) => (
        <View key={index} className="flex-row items-start gap-3">
          <Text className="text-sm font-semibold text-primary">{index + 1}</Text>
          <Text className="text-xs">{note}</Text>
        </View>
      ))}
    </View>
  ),
};
