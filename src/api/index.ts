import fakePackData from '@/api/fakeData/pack.json';
import { CountryData } from '@/types';

export const fetchCountryData = async (id: string): Promise<CountryData> => {
  // Simulate API delay
  // await new Promise((resolve) => setTimeout(resolve, 500));

  // TODO: Replace with actual API call
  console.log('Fetching data for country:', id);
  return fakePackData as unknown as CountryData;
};
