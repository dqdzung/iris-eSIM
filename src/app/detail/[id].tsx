import { Stack, useLocalSearchParams, usePathname } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CountryData } from '@/types';
import DetailHeader from '@/components/detail/DetailHeader';
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
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SearchActionSheet } from '@/components/detail/SearchActionSheet';

export default function DetailScreen() {
  const { i18n, t } = useTranslation();
  const { id: countryId } = useLocalSearchParams<{ id: string }>();
  const path = usePathname();

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
  const packages = useMemo(() => data?.packages || [], [data]);

  const name = useMemo(() => {
    if (!regionInfo) return '';
    const isEnglish = i18n.language === 'en-US';
    return isEnglish ? regionInfo?.name : regionInfo?.name_vi;
  }, [regionInfo, i18n.language]);

  const carriers = regionInfo?.carriers.join(', ') || '';

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

  useEffect(() => {
    if (countryId) {
      fetchCountryData(countryId).then(setData);
    }
  }, [countryId]);

  useEffect(() => {
    if (selectedPackage && !isPurchaseSheetVisible) {
      setPurchaseSheetVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPackage]);

  // reopen action sheet when backing from checkout
  useEffect(() => {
    if (!isPurchaseSheetVisible && selectedPackage && path === `/detail/${countryId}`) {
      setPurchaseSheetVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  if (!data || !regionInfo) return null;

  return (
    <ScrollView contentContainerClassName="flex-1 gap-6 p-4">
      <Stack.Screen
        options={{
          title: name,
          headerRight: () => (
            <Pressable onPress={() => setSearchSheetVisible(true)}>
              <MagnifyingGlassIcon className="mr-4 h-6 w-6 text-white" />
            </Pressable>
          ),
        }}
      />

      <DetailHeader
        banner={regionInfo.banner}
        flag={regionInfo.flag}
        lowestPrice={lowestPrice}
        highestPrice={highestPrice}
        carriers={carriers}
        coverage={regionInfo?.coverage_area}
      />

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
        <PurchaseActionSheet
          selectedPackage={selectedPackage}
          visible={isPurchaseSheetVisible}
          onClose={() => setPurchaseSheetVisible(false)}
        />
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
