import { Country, Package } from '@/types';
import { PARTNER } from '@/constants';
import ApiService from './apiService';
import {
  ApiResponse,
  AuthenticateResponse,
  HttpError,
  TypeLocation,
  VerifySessionResponse,
} from './type';
import { API_PATH } from './apiPath';

const apiService = new ApiService();

export const authenticate = async (): Promise<ApiResponse<AuthenticateResponse | null>> => {
  try {
    const res = await apiService.post<AuthenticateResponse>(API_PATH.login, {
      customerId: 'TEST_CUST_001',
      name: 'Test User',
      mobile: '0901234567',
      email: 'test@example.com',
    });
    return { success: true, data: res };
  } catch (error) {
    const err = error as HttpError;
    return {
      success: false,
      message: err.cause?.detail?.error,
      data: null,
    };
  }
};

export const verifySession = async (
  loginToken: string
): Promise<ApiResponse<VerifySessionResponse | null>> => {
  try {
    const res = await apiService.post<VerifySessionResponse>(API_PATH.verify, {
      loginToken,
    });
    return { success: true, data: res };
  } catch (error) {
    const err = error as HttpError;
    return {
      success: false,
      message: err.cause?.detail?.error,
      data: null,
    };
  }
};

export const verifyInfo = async (): Promise<ApiResponse<VerifySessionResponse | null>> => {
  try {
    const res = await apiService.get<VerifySessionResponse>(API_PATH.info);
    return { success: true, data: res };
  } catch (error) {
    const err = error as HttpError;
    return {
      success: false,
      message: err.cause?.detail?.error,
      data: null,
    };
  }
};

export const fetchRegions = async (
  typeLocation: TypeLocation | '' = '',
  keyword: string = ''
): Promise<ApiResponse<Country[]>> => {
  try {
    const res = await apiService.post<{ data: Country[] }>(API_PATH.regions, {
      typeLocation,
      partner: PARTNER,
      keyword,
    });
    return { success: true, data: res.data ?? [] };
  } catch (error) {
    const err = error as HttpError;
    return {
      success: false,
      message: err.cause?.detail?.error,
      data: [],
    };
  }
};

export const fetchPackages = async (id: string): Promise<ApiResponse<Package[]>> => {
  try {
    const res = await apiService.post<{ data: Package[] }>(API_PATH.packs, {
      locationId: Number(id),
      partner: PARTNER,
    });
    return { success: true, data: res.data ?? [] };
  } catch (error) {
    const err = error as HttpError;
    return {
      success: false,
      message: err.cause?.detail?.error,
      data: [],
    };
  }
};

const refreshAuth = async (): Promise<boolean> => {
  const auth = await authenticate();
  if (!auth.success || !auth.data?.loginToken) return false;
  const verify = await verifySession(auth.data.loginToken);
  return verify.success;
};

apiService.setAuthRefreshHandler(refreshAuth);
