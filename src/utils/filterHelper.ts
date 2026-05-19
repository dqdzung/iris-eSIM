import { Country } from '@/types';
import { toLowerCaseNonAccentVietnamese } from '.';
import { SPECIAL_CHAR_REGEX } from '@/constants/regex';

const filterCountry = (data: Country[], searchTerm?: string) => {
  let filtered = [...data];
  if (searchTerm) {
    const escapedSearchTerm = toLowerCaseNonAccentVietnamese(searchTerm).replace(
      SPECIAL_CHAR_REGEX,
      '\\$&'
    );
    const regex = new RegExp(escapedSearchTerm, 'i');
    const res = data.filter((country) => {
      const { nameLocation, code } = country;
      const viName = toLowerCaseNonAccentVietnamese(country.nameVi);
      if (!nameLocation && !code && !viName) return false;
      return regex.test(nameLocation) || regex.test(viName) || regex.test(code);
    });
    filtered = [...res];
  }
  return filtered;
};

const filterDevice = (data: { name: string; brand: string }[], searchTerm?: string) => {
  let filtered = [...data];
  if (searchTerm) {
    const escapedSearchTerm = toLowerCaseNonAccentVietnamese(searchTerm).replace(
      SPECIAL_CHAR_REGEX,
      '\\$&'
    );
    const regex = new RegExp(escapedSearchTerm, 'i');
    const res = data.filter((d) => {
      const { name, brand } = d;
      if (!name) return false;
      return regex.test(name) || regex.test(brand);
    });
    filtered = [...res];
  }
  return filtered;
};

export { filterCountry, filterDevice };
