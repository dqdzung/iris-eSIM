import jsonData from './data.json';

const regions = [...jsonData];
const regionWithoutCountry = regions.map((item) => {
  const { countries, ...rest } = item;
  return rest;
});
const countries = regions.map((item) => item.countries).flat();
const uniqueCountries = [...new Map(countries.map((item) => [item.id, item])).values()];
const countryAndRegion = [...regionWithoutCountry, ...uniqueCountries];
const fakeData = { regions, countries, uniqueCountries, countryAndRegion };

export default fakeData;
