import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { delay } from '@/utils';
import { filterCountry } from '@/utils/filterHelper';
import { Country } from '@/types';
import { useGlobalDataContext } from './useGlobalDataContext';

export const useCountrySearch = () => {
  const { countryAndRegion } = useGlobalDataContext();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Country[]>([]);

  const search = useCallback(
    async (searchTerm?: string) => {
      if (searchTerm) {
        setLoading(true);
        await delay(300);
        setLoading(false);
      }
      setResults(filterCountry(countryAndRegion, searchTerm));
    },
    [countryAndRegion]
  );

  const debouncedSearch = debounce(search, 500);

  const handleSearch = (value: string) => {
    if (!value) {
      search();
      return;
    }
    debouncedSearch(value.trim().toLocaleLowerCase());
  };

  return { loading, results, search, handleSearch };
};
