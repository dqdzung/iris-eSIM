import regionData from './data.json';
import deviceData from './eSIM_devices.json';

const regions = [...regionData];
const regionWithoutCountry = regions.map((item) => {
  const { countries, ...rest } = item;
  return rest;
});
const countries = regions.map((item) => item.countries).flat();
const uniqueCountries = [...new Map(countries.map((item) => [item.id, item])).values()];
const countryAndRegion = [...regionWithoutCountry, ...uniqueCountries];
const popularCountries = uniqueCountries.filter((c) => c.is_popular);
const popularRegions = regions.filter((r) => r.is_popular);

const allDevices = Object.keys(deviceData)
  .map((k) => {
    const devices = deviceData[k as keyof typeof deviceData];
    return devices.map((d) => ({ name: d, brand: k }));
  })
  .flat();

const fakeData = {
  regions,
  countries,
  uniqueCountries,
  countryAndRegion,
  popularCountries,
  popularRegions,
  allDevices,
};

export default fakeData;
