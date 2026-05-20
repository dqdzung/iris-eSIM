import { Country, Package } from '@/types';
import { PARTNER } from '@/constants';
import ApiService from './apiService';
import { AuthenticateResponse, HttpError, TypeLocation, VerifySessionResponse } from './type';
import { API_PATH } from './apiPath';

type RegionsApiItem = Omit<Country, 'fromPrice' | 'fromPriceUsd'> & {
  fromPrice: string;
  fromPriceUsd: string;
};

const apiService = new ApiService();

export const fetchPackages = async (id: string): Promise<Package[]> => {
  const res = await apiService.post<{ data: Package[] }>(API_PATH.packs, {
    locationId: Number(id),
    partner: PARTNER,
  });
  return res.data ?? [];
};

export const authenticate = async (): Promise<{
  success: boolean;
  message?: string;
  data: AuthenticateResponse | null;
}> => {
  try {
    const res = await apiService.post<AuthenticateResponse>(API_PATH.login, {
      customerId: 'TEST_CUST_001',
      name: 'Test User',
      mobile: '0901234567',
      email: 'test@example.com',
    });

    if (res) {
      return {
        success: true,
        data: res,
      };
    }

    return {
      success: false,
      data: null,
    };
  } catch (error) {
    const err = error as HttpError;
    const msg = err.cause?.detail?.error;

    return {
      success: false,
      message: msg,
      data: null,
    };
  }
};

export const verifySession = async (
  loginToken: string
): Promise<{
  success: boolean;
  message?: string;
  data: VerifySessionResponse | null;
}> => {
  try {
    const res = await apiService.post<VerifySessionResponse>(API_PATH.verify, {
      loginToken,
    });

    if (res) {
      return {
        success: true,
        data: res,
      };
    }

    return {
      success: false,
      data: null,
    };
  } catch (error) {
    const err = error as HttpError;
    const msg = err.cause?.detail?.error;

    return {
      success: false,
      message: msg,
      data: null,
    };
  }
};

export const verifyInfo = async (): Promise<{
  success: boolean;
  message?: string;
  data: VerifySessionResponse | null;
}> => {
  try {
    const res = await apiService.get<VerifySessionResponse>(API_PATH.info);

    if (res) {
      return {
        success: true,
        data: res,
      };
    }

    return {
      success: false,
      data: null,
    };
  } catch (error) {
    const err = error as HttpError;
    const msg = err.cause?.detail?.error;

    return {
      success: false,
      message: msg,
      data: null,
    };
  }
};

export const fetchRegions = async (
  typeLocation: TypeLocation | '' = '',
  keyword: string = ''
): Promise<{
  success: boolean;
  message?: string;
  data: Country[];
}> => {
  try {
    const res = await apiService.post<{ data: RegionsApiItem[] }>(API_PATH.regions, {
      typeLocation,
      partner: PARTNER,
      keyword,
    });
    const items = (res.data ?? []).map((item) => ({
      ...item,
      fromPrice: Number(item.fromPrice),
      fromPriceUsd: Number(item.fromPriceUsd),
    }));
    return { success: true, data: items };
  } catch (error) {
    const err = error as HttpError;
    return {
      success: false,
      message: err.cause?.detail?.error,
      data: [],
    };
  }
};
