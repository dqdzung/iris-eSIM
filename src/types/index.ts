export type Carrier = {
  name: string;
  logo: string;
};

export type RegionInfo = {
  name: string;
  name_vi: string;
  flag: string;
  banner: string;
  carriers: string[];
  coverage_area: string;
};

export type Package = {
  id: string;
  type: 'DAILY' | 'UNLIMITED' | 'FIXED';
  validity_days: number;
  data_amount: number;
  data_unit: 'GB' | 'MB';
  selling_price: number;
  selling_price_usd: number;
  tiktok: 'ENABLE' | 'DISABLE';
};

export type CountryData = {
  region_info: RegionInfo;
  packages: Package[];
};

export type Country = any;
