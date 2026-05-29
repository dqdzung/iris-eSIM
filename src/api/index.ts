import { Country, Package, Transaction, TransactionResult } from '@/types';
import { PARTNER } from '@/constants';
import ApiService from './apiService';
import {
  ApiResponse,
  AuthenticateResponse,
  HttpError,
  PreparePaymentResponse,
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
  toApiResponse<Package[]>(async () => {
    const data =
      (
        await apiService.post<{ data: Package[] }>(API_PATH.packs, {
          locationId: Number(id),
          partner: PARTNER,
        })
      ).data ?? [];

    // MOCK[tiktok-filter]: backend currently returns tiktok:true for every
    // package, making the toggle a no-op. Flip every other one to false so
    // the filter is visible. REMOVE THIS BLOCK once backend ships mixed
    // values — search for "MOCK[tiktok-filter]" to find it.
    data.forEach((p, i) => {
      if (i % 2 === 0) p.tiktok = false;
    });

    return data;
  }, []);

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
