import { authenticate, fetchRegions, verifyInfo, verifySession } from '@/api';
import fakeData from '@/api/fakeData/data';
import { ToastProvider, useToast } from '@/components/Toast';
import { Colors } from '@/constants/theme';
import { Country } from '@/types';
import { Stack } from 'expo-router';
import { orderBy } from 'lodash';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}

type GlobalData = {
  regions: Country[];
  uniqueCountries: Country[];
  countryAndRegion: Country[];
  popularCountries: Country[];
  popularRegions: Country[];
  listDevice: typeof fakeData.allDevices;
};

const GlobalDataContext = createContext<GlobalData>({
  regions: [],
  uniqueCountries: [],
  countryAndRegion: [],
  popularCountries: [],
  popularRegions: [],
  listDevice: [],
});

const GlobalDataProvider = ({ children }: { children: ReactNode }) => {
  const { i18n, t } = useTranslation();
  const toast = useToast();

  const [regions, setRegions] = useState<Country[]>([]);
  const [uniqueCountries, setUniqueCountries] = useState<Country[]>([]);

  const sortBy: keyof Country = i18n.language === 'en-US' ? 'nameLocation' : 'nameVi';

  const sortedRegions = useMemo(
    () => orderBy(regions, [(r) => String(r[sortBy]).toLowerCase()], ['asc']),
    [regions, sortBy]
  );

  const sortedUniqueCountries = useMemo(
    () => orderBy(uniqueCountries, [(c) => String(c[sortBy]).toLowerCase()], ['asc']),
    [uniqueCountries, sortBy]
  );

  const sortedCountryAndRegion = useMemo(
    () => [...sortedRegions, ...sortedUniqueCountries],
    [sortedRegions, sortedUniqueCountries]
  );

  const popularCountries = useMemo(
    () => sortedUniqueCountries.filter((c) => c.isPopular),
    [sortedUniqueCountries]
  );
  const popularRegions = useMemo(() => sortedRegions.filter((r) => r.isPopular), [sortedRegions]);

  useEffect(() => {
    authenticate().then((res) => {
      if (res.success && res.data?.loginToken) {
        verifySession(res.data?.loginToken).then(() => {
          fetchRegions().then((r) => {
            if (!r.success) {
              toast.error(t('toast.load_country_failed'));
              return;
            }
            setUniqueCountries(r.data.filter((item) => item.typeLocation === 'COUNTRY'));
            setRegions(r.data.filter((item) => item.typeLocation === 'REGION'));
          });
        });
      }
      // verifyInfo();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GlobalDataContext
      value={{
        regions: sortedRegions,
        uniqueCountries: sortedUniqueCountries,
        countryAndRegion: sortedCountryAndRegion,
        popularCountries,
        popularRegions,
        listDevice: fakeData.allDevices,
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
