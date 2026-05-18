import fakePackData from '@/api/fakeData/pack.json';
import { CountryData } from '@/types';
import ApiService from './apiService';
import { AuthenticateResponseData, HttpError, VerifySessionResponseData } from './type';
import { API_PATH } from './apiPath';

const apiService = new ApiService();

export const fetchCountryData = async (id: string): Promise<CountryData> => {
  // Simulate API delay
  // await new Promise((resolve) => setTimeout(resolve, 500));

  // TODO: Replace with actual API call
  console.log('Fetching data for country:', id);
  return fakePackData as unknown as CountryData;
};

export const authenticate = async (): Promise<{
  success: boolean;
  message?: string;
  data: AuthenticateResponseData | null;
}> => {
  try {
    const res = await apiService.post<AuthenticateResponseData>(API_PATH.login, {
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
  data: VerifySessionResponseData | null;
}> => {
  try {
    const res = await apiService.post<VerifySessionResponseData>(API_PATH.verify, {
      loginToken,
    });

    if (res) {
      console.log(res);

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
  data: VerifySessionResponseData | null;
}> => {
  try {
    const res = await apiService.get<VerifySessionResponseData>(API_PATH.info);

    if (res) {
      console.log(res);

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
