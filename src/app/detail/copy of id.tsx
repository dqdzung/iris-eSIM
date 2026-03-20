import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Switch, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground } from 'expo-image';
import {
  CalendarDaysIcon,
  CircleStackIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { capitalize } from 'lodash';
import fakePackData from '@/utils/fakeData/pack.json';
import { Colors } from '@/constants/theme';
import { TFunction } from 'i18next';

const DetailScreen = () => {
  const { i18n, t } = useTranslation();
  const { id: countryId } = useLocalSearchParams<{ id: string }>();

  const [data, setData] = useState<any>();
  const [isTiktokSupported, setTiktokSupported] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedData, setSelectedData] = useState('');

  const localizedData = useMemo(() => {
    if (!data) return {};
    const { region_info: regionInfo, packages } = data;
    const isEnglish = i18n.language === 'en-US';
    const name = isEnglish ? regionInfo?.name : regionInfo?.name_vi;
    const flag = regionInfo?.flag;
    const banner = regionInfo?.banner;
    const carriers = regionInfo?.carriers.join(', ');

    const lowestPricePack = packages.reduce((prev: any, curr: any) => {
      const condition = isEnglish
        ? prev.selling_price_usd < curr.selling_price_usd
          ? prev
          : curr
        : prev.selling_price < curr.selling_price
          ? prev
          : curr;
      return condition;
    });
    const lowestPrice = isEnglish
      ? lowestPricePack.selling_price_usd
      : lowestPricePack.selling_price;
    const formattedLowest = formatCurrency(lowestPrice, i18n.language, isEnglish ? 'USD' : 'VND');
    const highestPricePack = packages.reduce((prev: any, curr: any) => {
      const condition = isEnglish
        ? prev.selling_price_usd > curr.selling_price_usd
          ? prev
          : curr
        : prev.selling_price > curr.selling_price
          ? prev
          : curr;
      return condition;
    });
    const highestPrice = isEnglish
      ? highestPricePack.selling_price_usd
      : highestPricePack.selling_price;
    const formattedHighestPrice = formatCurrency(
      highestPrice,
      i18n.language,
      isEnglish ? 'USD' : 'VND'
    );

    return {
      name,
      flag,
      banner,
      lowestPrice: formattedLowest,
      highestPrice: formattedHighestPrice,
      carriers,
      coverage: regionInfo.coverage_area,
    };
  }, [data, i18n.language]);

  const listFilterButton = useMemo(() => {
    if (!data) return {};
    const { packages } = data;
    const listDay: number[] = packages.map((item: any) => item.validity_days);
    const uniqueDay = [...new Set(listDay)].sort((a, b) => a - b);
    const listData: string[] = packages.map((item: any) => {
      const isDaily = item.type === 'DAILY';
      return `${item.data_amount}${item.data_unit}${isDaily ? `/${t('day')}` : ''}`;
    });
    const uniqueData = [...new Set(listData)];
    const sortedData = uniqueData.sort((a, b) => dataSortFunc(a, b, t));

    return {
      day: uniqueDay,
      data: sortedData,
    };
  }, [data, t]);

  const validDayOption = useMemo(() => {
    if (!data) return [];
    if (!selectedData) return listFilterButton.day;
    const { packages } = data;
    const objSelectedData = convertDataStringToObj(selectedData);
    const res = packages.filter(
      (item: any) =>
        item.data_amount === objSelectedData.amount &&
        item.data_unit === objSelectedData.unit &&
        (objSelectedData.isDaily ? item.type === 'DAILY' : item.type !== 'DAILY') && //filter daily package
        (isTiktokSupported ? item.tiktok === 'ENABLE' : item.tiktok === 'DISABLE') // filter tiktok support
    );

    return res.map((item: any) => item.validity_days);
  }, [data, isTiktokSupported, listFilterButton.day, selectedData]);

  const validDataOption = useMemo(() => {
    if (!data) return [];
    if (!selectedDay) return listFilterButton.data;
    const { packages } = data;
    const res = packages.filter(
      (item: any) =>
        item.validity_days === selectedDay &&
        (isTiktokSupported ? item.tiktok === 'ENABLE' : item.tiktok === 'DISABLE') // filter tiktok support
    );

    return res.map((item: any) => convertDataObjToString(item, t));
  }, [data, isTiktokSupported, listFilterButton.data, selectedDay, t]);

  const selectedPackage = useMemo(() => {
    if (!data || !selectedDay || !selectedData) return [];
    const { packages } = data;
    const objSelectedData = convertDataStringToObj(selectedData);
    const selectedPackage = packages.filter(
      (item: any) =>
        item.validity_days === selectedDay &&
        item.data_amount === objSelectedData.amount &&
        item.data_unit === objSelectedData.unit &&
        (objSelectedData.isDaily ? item.type === 'DAILY' : item.type !== 'DAILY') && //filter daily package
        (isTiktokSupported ? item.tiktok === 'ENABLE' : item.tiktok === 'DISABLE') // filter tiktok support
    );
    console.log('selectedPackage', selectedPackage);
    return selectedPackage;
  }, [data, isTiktokSupported, selectedData, selectedDay]);

  const handleToggle = () => {
    setTiktokSupported((prev) => !prev);
  };

  const handleSelectDay = useCallback(
    (day: number) => {
      if (day === selectedDay) {
        setSelectedDay(0);
        return;
      }
      setSelectedDay(day);
      if (selectedData && !validDayOption.includes(day)) {
        setSelectedData('');
      }
    },
    [selectedData, selectedDay, validDayOption]
  );

  const handleSelectData = useCallback(
    (data: string) => {
      if (data === selectedData) {
        setSelectedData('');
        return;
      }
      setSelectedData(data);
      if (selectedDay && !validDataOption.includes(data)) {
        setSelectedDay(0);
      }
    },
    [selectedData, selectedDay, validDataOption]
  );

  const fetchData = useCallback(async (id: string) => {
    // await delay(500);
    const res = { ...fakePackData };
    setData(res);
  }, []);

  useEffect(() => {
    fetchData(countryId);
  }, [countryId, fetchData]);

  return (
    <ScrollView contentContainerClassName="flex-1 gap-6 p-4">
      <Stack.Screen options={{ title: localizedData.name }} />

      <ImageBackground source={localizedData.banner || ''} className="rounded-xl">
        <View className="gap-6 rounded-xl bg-black/45 p-3">
          <View className="flex-row items-center justify-between">
            <View className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-100">
              <Image source={localizedData.flag} className="h-full w-full" />
            </View>

            <Pressable className="flex-row gap-1 rounded-xl bg-white/50 px-2 py-1 backdrop-blur-sm hover:bg-white/70">
              <Text className="text-xs">{capitalize(t('check_compatibility'))}</Text>
              <QuestionMarkCircleIcon className="h-4 w-4" />
            </Pressable>
          </View>

          <Text className="text-[24px] text-white">
            {localizedData.lowestPrice} - {localizedData.highestPrice}
          </Text>

          <View className="flex-row items-end justify-between gap-2">
            <View className="flex-col gap-1">
              {[
                { key: 'carrier', value: localizedData.carriers },
                { key: 'coverage', value: localizedData.coverage },
                { key: 'activation', value: '' },
              ].map(({ key, value }: { key: string; value: string }) => (
                <Text key={key} className="text-white">
                  {capitalize(t(key))}: {value}
                </Text>
              ))}
            </View>

            <Pressable>
              <InformationCircleIcon className="h-7 w-7 text-white hover:text-white/90" />
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <View className="gap-4 rounded-lg border-2 border-gray-200 px-6 py-3 drop-shadow-sm">
        <View className="flex-row items-center gap-2">
          <CalendarDaysIcon className="h-6 w-6 text-primary" />
          <Text className="text-lg">{capitalize(t('choose_day'))}</Text>
        </View>

        <View className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
          {listFilterButton.day?.map((day: number) => {
            const isDayValid = selectedData ? validDayOption.includes(day) : true;
            const supportTiktokCheck = !isTiktokSupported
              ? true
              : data.packages.some(
                  (item: any) => item.validity_days === day && item.tiktok === 'ENABLE'
                );
            const isValid = isDayValid && supportTiktokCheck;

            const baseClass = 'rounded-md border border-primary p-2';
            const selectedStyle = `${selectedDay === day ? 'bg-primary text-white shadow-md' : 'bg-gray-200'}`;
            const validStyle = `${!isValid ? 'cursor-not-allowed border-gray-300/5 text-gray-400' : ''}`;
            const hoverStyle = `${selectedDay !== day && isValid ? 'hover:bg-primary/20' : ''}`;

            const className = `${baseClass} ${selectedStyle} ${validStyle} ${hoverStyle}`;

            return (
              <Pressable key={day} onPress={() => handleSelectDay(day)} className={className}>
                <Text className="text-center text-inherit">{day}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="gap-4 rounded-lg border-2 border-gray-200 px-6 py-3 drop-shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <CircleStackIcon className="h-6 w-6 text-primary" />
            <Text className="text-lg">{capitalize(t('choose_data'))}</Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="italic text-gray-400">Support: </Text>
            <Image className="h-5 w-5" source={require('../../../assets/tiktok-logo.png')} />

            <Switch
              //@ts-expect-error
              activeThumbColor="white"
              trackColor={{ false: 'gray', true: Colors.primary }}
              value={isTiktokSupported}
              onValueChange={handleToggle}
            />
          </View>
        </View>

        <View className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {listFilterButton.data?.map((amount: string) => {
            const isDataValid = selectedDay ? validDataOption.includes(amount) : true;
            const { amount: dataAmount, unit } = convertDataStringToObj(amount);
            const supportTiktokCheck = !isTiktokSupported
              ? true
              : data.packages.some(
                  (item: any) =>
                    item.data_amount === dataAmount &&
                    item.data_unit === unit &&
                    item.tiktok === 'ENABLE'
                );
            const isValid = isDataValid && supportTiktokCheck;

            const baseClass = 'rounded-md border border-primary p-4';
            const selectedStyle = `${selectedData === amount ? 'bg-primary text-white shadow-md' : 'bg-gray-200'}`;
            const validStyle = `${!isValid ? 'cursor-not-allowed border-gray-300/5 text-gray-400' : ''}`;
            const hoverStyle = `${selectedData !== amount && isValid ? 'hover:bg-primary/20' : ''}`;

            const className = `${baseClass} ${selectedStyle} ${validStyle} ${hoverStyle}`;

            return (
              <Pressable
                className={className}
                key={amount}
                onPress={() => handleSelectData(amount)}>
                <Text className="text-center text-inherit">
                  {amount === '0GB' ? capitalize(t('unlimited')) : amount}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selectedPackage.length > 0 && (
          <View className="gap-4 rounded-lg border-2 border-gray-200 px-6 py-3 drop-shadow-sm">
            <Text>{JSON.stringify(selectedPackage[0])}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DetailScreen;

const dataSortFunc = (a: string, b: string, t: TFunction) => {
  const extractValue = (str: string): number => {
    const value = parseInt(str);
    const unit = str.replace(String(value), '').replace(`/${t('day')}`, '');
    if (unit === 'GB') return value * 1000; // Convert GB to MB for comparison
    return value; // Assume MB if unit is not GB
  };

  const aValue = extractValue(a);
  const bValue = extractValue(b);

  if (aValue === 0 && bValue !== 0) return 1;
  if (bValue === 0 && aValue !== 0) return -1;
  if (aValue !== bValue) {
    return aValue - bValue;
  }
  const aIsDaily = a.includes(`/${t('day')}`);
  const bIsDaily = b.includes(`/${t('day')}`);
  return aIsDaily && !bIsDaily ? -1 : bIsDaily && !aIsDaily ? 1 : 0;
};

const convertDataStringToObj = (item: string) => {
  const isDaily = item.includes('/day');
  const cleanedItem = item.replace('/day', '');
  const [amountStr, unit] = cleanedItem.split(/([A-Za-z]+)/).filter(Boolean);
  const amount = parseFloat(amountStr);

  return {
    amount,
    unit,
    isDaily,
  };
};

const convertDataObjToString = (item: any, t: TFunction) => {
  const isDaily = item.type === 'DAILY';
  return `${item.data_amount}${item.data_unit}${isDaily ? `/${t('day')}` : ''}`;
};
