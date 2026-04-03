import fakeData from '@/api/fakeData/data';
import { Colors } from '@/constants/theme';
import { Stack } from 'expo-router';
import { orderBy } from 'lodash';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <GlobalDataProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail/[id]" />
      </Stack>
    </GlobalDataProvider>
  );
}

const GlobalDataContext = createContext<{
  regions: typeof fakeData.regions;
  uniqueCountries: typeof fakeData.uniqueCountries;
  countryAndRegion: typeof fakeData.countryAndRegion;
}>({
  regions: [],
  uniqueCountries: [],
  countryAndRegion: [],
});

const GlobalDataProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();

  const sortBy = useMemo(() => (i18n.language === 'en-US' ? 'name' : 'name_vi'), [i18n.language]);

  const sortedRegions = useMemo(() => {
    const sorted = orderBy(fakeData.regions, [(region) => region[sortBy].toLowerCase()], ['asc']);
    return sorted;
  }, [sortBy]);

  const sortedUniqueCountries = useMemo(() => {
    const sorted = orderBy(
      fakeData.uniqueCountries,
      [(region) => region[sortBy].toLowerCase()],
      ['asc']
    );
    return sorted;
  }, [sortBy]);

  const sortedCountryAndRegion = useMemo(() => {
    const sorted = orderBy(
      fakeData.countryAndRegion,
      [(region) => region[sortBy].toLowerCase()],
      ['asc']
    );
    return sorted;
  }, [sortBy]);

  return (
    <GlobalDataContext
      value={{
        regions: sortedRegions,
        uniqueCountries: sortedUniqueCountries,
        countryAndRegion: sortedCountryAndRegion,
      }}>
      <SafeAreaView className="h-full">{children}</SafeAreaView>
    </GlobalDataContext>
  );
};

export const useGlobalDataContext = () => {
  const context = useContext(GlobalDataContext);
  if (!context) {
    throw new Error('useGlobalDataContext must be used within a GlobalDataProvider');
  }
  return context;
};
