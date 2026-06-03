import { PARTNER } from '@/constants';
import type { Country, Package, Transaction, TransactionResult } from '@/types';

import { API_PATH } from './apiPath';
import ApiService from './apiService';
import { readCustomerCredsFromUrl, TEST_CREDS } from './helper';
import type {
  ApiResponse,
  AuthenticateResponse,
  HttpError,
  PreparePaymentResponse,
  TransactionsFilter,
  TypeLocation,
  VerifySessionResponse,
} from './type';

const apiService = new ApiService();

async function toApiResponse<T>(apiCall: () => Promise<T>, fallback: T): Promise<ApiResponse<T>> {
  try {
    return { success: true, data: await apiCall() };
  } catch (error) {
    return {
      success: false,
      message: (error as HttpError).cause?.detail?.error,
      data: fallback,
    };
  }
}

export const authenticate = (): Promise<ApiResponse<AuthenticateResponse | null>> => {
  const creds = readCustomerCredsFromUrl() ?? TEST_CREDS;
  return toApiResponse<AuthenticateResponse | null>(
    () => apiService.post<AuthenticateResponse>(API_PATH.login, creds),
    null
  );
};

export const verifySession = (
  loginToken: string
): Promise<ApiResponse<VerifySessionResponse | null>> =>
  toApiResponse<VerifySessionResponse | null>(
    () => apiService.post<VerifySessionResponse>(API_PATH.verify, { loginToken }),
    null
  );

export const verifyInfo = (): Promise<ApiResponse<VerifySessionResponse | null>> =>
  toApiResponse<VerifySessionResponse | null>(
    () => apiService.get<VerifySessionResponse>(API_PATH.info),
    null
  );

export const fetchRegions = (
  typeLocation: TypeLocation | '' = '',
  keyword: string = ''
): Promise<ApiResponse<Country[]>> =>
  toApiResponse<Country[]>(
    async () =>
      (
        await apiService.post<{ data: Country[] }>(API_PATH.regions, {
          typeLocation,
          partner: PARTNER,
          keyword,
        })
      ).data ?? [],
    []
  );

export const fetchPackages = (id: string): Promise<ApiResponse<Package[]>> =>
  toApiResponse<Package[]>(
    async () =>
      (
        await apiService.post<{ data: Package[] }>(API_PATH.packs, {
          locationId: Number(id),
          partner: PARTNER,
        })
      ).data ?? [],
    []
  );

export const fetchTransactions = (
  page: number = 1,
  size: number = 20,
  filter: TransactionsFilter = {}
): Promise<ApiResponse<Transaction[]>> =>
  toApiResponse<Transaction[]>(async () => {
    const params: Record<string, string | number> = {
      partner: PARTNER,
      page,
      size,
    };
    if (filter.beginTime) params.beginTime = filter.beginTime;
    if (filter.endTime) params.endTime = filter.endTime;
    return (
      (await apiService.get<{ data: Transaction[] }>(API_PATH.transactions, params)).data ?? []
    );
  }, []);

export const fetchTransactionResult = (
  trackingId: string
): Promise<ApiResponse<TransactionResult | null>> =>
  toApiResponse<TransactionResult | null>(
    async () =>
      (
        await apiService.get<{ data: TransactionResult }>(`${API_PATH.result}/${trackingId}`, {
          partner: PARTNER,
        })
      ).data ?? null,
    null
  );

export const preparePayment = ({
  packCode,
  email,
  quantity = 1,
  locationId,
}: {
  packCode: string;
  email: string;
  quantity?: number;
  locationId?: number;
}): Promise<ApiResponse<PreparePaymentResponse | null>> =>
  toApiResponse<PreparePaymentResponse | null>(
    async () =>
      (
        await apiService.post<{ data: PreparePaymentResponse }>(API_PATH.prepare, {
          partner: PARTNER,
          packCode,
          email,
          quantity,
          locationId,
        })
      ).data ?? null,
    null
  );

const refreshAuth = async (): Promise<boolean> => {
  const auth = await authenticate();
  if (!auth.success || !auth.data?.loginToken) return false;
  const verify = await verifySession(auth.data.loginToken);
  return verify.success;
};

apiService.setAuthRefreshHandler(refreshAuth);

export const onAuthLost = (handler: (() => void) | null) => apiService.setAuthLostHandler(handler);
