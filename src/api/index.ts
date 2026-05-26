import { Country, Package, Transaction, TransactionResult } from '@/types';
import { PARTNER } from '@/constants';
import ApiService from './apiService';
import {
  ApiResponse,
  AuthenticateResponse,
  HttpError,
  TransactionsFilter,
  TypeLocation,
  VerifySessionResponse,
} from './type';
import { API_PATH } from './apiPath';

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

export const authenticate = (): Promise<ApiResponse<AuthenticateResponse | null>> =>
  toApiResponse<AuthenticateResponse | null>(
    () =>
      // TODO: Replace with real authentication data from url params
      apiService.post<AuthenticateResponse>(API_PATH.login, {
        customerId: 'TEST_CUST_001',
        name: 'Test User',
        mobile: '0901234567',
        email: 'test@example.com',
      }),
    null
  );

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
    if (filter.fromDate) params.fromDate = filter.fromDate;
    if (filter.toDate) params.toDate = filter.toDate;
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

const refreshAuth = async (): Promise<boolean> => {
  const auth = await authenticate();
  if (!auth.success || !auth.data?.loginToken) return false;
  const verify = await verifySession(auth.data.loginToken);
  return verify.success;
};

apiService.setAuthRefreshHandler(refreshAuth);
