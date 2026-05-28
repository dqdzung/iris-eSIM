import { Pressable, Text, View } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, useRouter } from 'expo-router';
import { filterCountry } from '@/utils/filterHelper';
import ListCountryRegion from '@/components/ListCountryRegion';
import CompatibilityButton from '@/components/CompatibilityButton';
import HistoryButton from '@/components/HistoryButton';
import { Image } from 'expo-image';
import headerImg from '@assets/header.jpg';
import LoadingOverlay from '@/components/LoadingOverlay';
import NavHeader from '@/components/NavHeader';
import { useGlobalDataContext } from '@/hooks/useGlobalDataContext';
import { Bookmark, BookMarked, BookOpen, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { capitalize } from 'lodash';
import GuideButton from '@/components/GuideButton';

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

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <NavHeader actions={<HistoryButton showLabel={false} />}>
        <Text className="text-base font-semibold text-white">{t('home_screen.app_title')}</Text>
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

        <ListCountryRegion data={listData} handlePress={handlePress} />
        <GuideButton />

        <LoadingOverlay isVisible={bootLoading} />
      </View>
    </View>
  );
}
