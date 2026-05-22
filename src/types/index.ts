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

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export type EsimInfo = {
  iccid: string;
  esimCode: string;
  qrCode: string;
  activationURL: string;
  expiryDate: string;
};

export type TransactionResultItem = {
  quantity: number;
  discountAmount: number;
  regionName: string;
  productName: string;
  status: string;
  esims: EsimInfo[];
};

export type TransactionResult = {
  trackingId: string;
  status: TransactionStatus;
  errorMessage: string | null;
  wellzoneOrderId: string;
  orderCode: string;
  email: string;
  orderStatus: string;
  transactionId: string;
  createDate: string;
  items: TransactionResultItem[];
};
