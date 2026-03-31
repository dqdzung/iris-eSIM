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
      const { name, iso_code, code } = country;
      const viName = toLowerCaseNonAccentVietnamese(country.name_vi);
      if (!name && !iso_code && !code && !viName) return false;
      return regex.test(name) || regex.test(iso_code) || regex.test(viName) || regex.test(code);
    });
    filtered = [...res];
  }
  return filtered;
};

export { filterCountry };
