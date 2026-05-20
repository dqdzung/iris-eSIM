import { authenticate, verifySession, fetchRegions } from '@/api';
import fakeData from '@/api/fakeData/data';
import { useToast } from '@/components/Toast';
import { Country } from '@/types';
import { orderBy } from 'lodash';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export const GlobalDataContext = createContext<GlobalData>({
  regions: [],
  uniqueCountries: [],
  countryAndRegion: [],
  popularCountries: [],
  popularRegions: [],
  listDevice: [],
  loading: false,
});

export const GlobalDataProvider = ({ children }: { children: ReactNode }) => {
  const { i18n, t } = useTranslation();
  const toast = useToast();

  const [regions, setRegions] = useState<Country[]>([]);
  const [uniqueCountries, setUniqueCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

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

  const initializeData = (data: GlobalDataResult) => {
    switch (data.result) {
      case 'ok':
        setUniqueCountries(data.countries || []);
        setRegions(data.regions || []);
        return;
      case 'load_failed':
        toast.error(t('toast.load_country_failed'));
        return;
      case 'auth_failed':
        // TODO: navigate error screen
        return;
    }
  };

  useEffect(() => {
    // flag to prevent phantom loading state
    let cancelled = false;
    fetchGlobalData()
      .then((data) => !cancelled && initializeData(data))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
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
        loading,
      }}>
      <SafeAreaView className="h-full">{children}</SafeAreaView>
    </GlobalDataContext>
  );
};

type GlobalDataResult = {
  result: 'ok' | 'auth_failed' | 'load_failed';
  countries?: Country[];
  regions?: Country[];
};

const fetchGlobalData = async (): Promise<GlobalDataResult> => {
  const auth = await authenticate();
  if (!auth.success || !auth.data?.loginToken) return { result: 'auth_failed' };
  await verifySession(auth.data.loginToken);
  const res = await fetchRegions();
  if (!res.success) return { result: 'load_failed' };
  const countries: Country[] = [];
  const regions: Country[] = [];
  res.data.forEach((item) => {
    if (item.typeLocation === 'COUNTRY') countries.push(item);
    if (item.typeLocation === 'REGION') regions.push(item);
  });
  return {
    result: 'ok',
    countries,
    regions,
  };
};

type GlobalData = {
  regions: Country[];
  uniqueCountries: Country[];
  countryAndRegion: Country[];
  popularCountries: Country[];
  popularRegions: Country[];
  listDevice: typeof fakeData.allDevices;
  loading: boolean;
};
