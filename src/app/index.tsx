import { Pressable, Text, View } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, useRouter } from 'expo-router';
import { filterCountry } from '@/utils/filterHelper';
import ListCountryRegion from '@/components/ListCountryRegion';
import CallButton from '@/components/CallButton';
import CompatibilityButton from '@/components/CompatibilityButton';
import DotStrip from '@/components/DotStrip';
import HistoryButton from '@/components/HistoryButton';
import { Image } from 'expo-image';
import headerImg from '@assets/header.jpg';
import LoadingOverlay from '@/components/LoadingOverlay';
import NavHeader from '@/components/NavHeader';
import { useGlobalDataContext } from '@/hooks/useGlobalDataContext';
import { Bookmark, BookMarked, BookOpen, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { capitalize } from 'lodash';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const { popularCountries, popularRegions, loading: bootLoading } = useGlobalDataContext();

  const [filterType, setFilterType] = useState<'country' | 'region'>('country');

  const listData = useMemo(() => {
    const list = filterType === 'country' ? popularCountries : popularRegions;
    return filterCountry(list);
  }, [filterType, popularCountries, popularRegions]);

  const handlePress = useCallback((id: number) => router.push(`/detail/${id}`), [router]);

  const handleChangeFilter = (type: string) => {
    setFilterType(type as 'country' | 'region');
  };

  const handleClickAll = () => {
    router.push(`/all`);
  };

  const handleClickGuide = () => {
    router.push(`/guide`);
  };

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <NavHeader>
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-white">{t('home_screen.app_title')}</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <DotStrip />
          <CallButton />
          <View className="h-5 w-px bg-white" />
          <HistoryButton showLabel={false} />
        </View>
      </NavHeader>

      <View className="relative flex-1 gap-2 p-4">
        <View className="mb-1 h-[70px] w-full overflow-hidden rounded-lg">
          <Image source={headerImg} className="h-full w-full" contentFit="cover" />
        </View>

        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1 flex-row items-center gap-2">
            {/* <SearchCountryInput /> */}
            <View className="flex-1 flex-row items-center justify-between rounded-full bg-white p-2 drop-shadow">
              <Pressable onPress={handleClickAll} className="flex-1 flex-row items-center gap-2">
                <Search className="h-5 w-5 stroke-2 text-primary" />
                <Text className="text-xs text-gray-400/80">{t('country_region_placeholder')}</Text>
              </Pressable>
            </View>
            <CompatibilityButton />
          </View>
        </View>

        <View className="flex-row justify-center gap-2">
          {['country', 'region'].map((type) => (
            <View key={type} className="flex-1">
              <Text
                onPress={() => handleChangeFilter(type)}
                className={`px-4 py-3 text-center text-gray-400 ${filterType === type ? 'font-semibold text-primary' : ''}`}>
                {capitalize(t(type))}
              </Text>
              <View className={`h-1 rounded-t-lg ${filterType === type ? 'bg-primary' : ''}`} />
            </View>
          ))}
        </View>

        <View className="mt-3 flex-row justify-between">
          <Text className="font-semibold text-primary">{capitalize(t('home_screen.popular'))}</Text>
          <Pressable className="flex-row items-center gap-1" onPress={handleClickAll}>
            <Text className="text-xs text-primary">{capitalize(t('home_screen.see_all'))}</Text>
            <ChevronLeft className="h-3 w-3 rotate-180 stroke-2 text-primary" />
          </Pressable>
        </View>

        <View className="flex-1 gap-2">
          <ListCountryRegion data={listData} handlePress={handlePress} />

          <View className="flex-row items-center justify-between gap-2 rounded-lg bg-white p-3 drop-shadow-sm">
            <View className="flex-row items-center gap-2">
              <BookMarked className="h-6 w-6 stroke-2 text-primary" />
              <Text className="text-xxs font-semibold text-primary">
                {capitalize(t('home_screen.detailed_guide'))}
              </Text>
            </View>

            <Pressable
              onPress={handleClickGuide}
              className="flex-row items-center gap-1 rounded-full border border-primary px-3 py-0.5">
              <Text className="text-xxs font-semibold text-primary">
                {capitalize(t('home_screen.view_guide'))}
              </Text>
              <ChevronRight className="h-5 w-5 stroke-2 text-primary" />
            </Pressable>
          </View>
        </View>

        <LoadingOverlay isVisible={bootLoading} />
      </View>
    </View>
  );
}
