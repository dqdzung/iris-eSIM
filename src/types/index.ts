export type Country = {
  locationId: number;
  code: string;
  nameLocation: string;
  nameVi: string;
  typeLocation: 'COUNTRY' | 'REGION';
  icon: string;
  banner: string;
  fromPrice: string;
  fromPriceUsd: string;
  isPopular?: boolean;
};

export type Package = {
  packId: number;
  packCode: string;
  packName: string;
  regionName: string;
  regionId: number;
  amount: number;
  dataVolume: string;
  dataUnit: 'GB' | 'MB';
  timeLimitDays: number;
  description: string;
  productCode: string;
  productName: string;
  flag: string;
  geographicType: string;
  operator: string;
  variantType: 'DAILY' | 'UNLIMITED' | 'FIXED';
  tiktok?: 'ENABLE' | 'DISABLE'; // backend hasn't shipped yet
};

export type Transaction = {
  id: string;
  trackingId: string;
  partner: string;
  billingCode: string;
  packCode: string;
  actualAmount: number;
  serviceId: string;
  productCode: string;
  createdTime: string;
  status: number;
  totalRows: number;
};
