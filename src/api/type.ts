export class HttpError extends Error {
  cause: { status: number; detail: Record<string, any> };
  constructor(
    message: string,
    cause: {
      status: number;
      detail: Record<string, any>;
    }
  ) {
    super(message);
    this.name = 'HttpError';
    this.cause = cause; // Custom property
  }
}

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type AuthenticateResponse = { loginToken: string };

export type VerifySessionResponse = {
  customer: any;
  expireInMinutes: number;
  sessionToken: string;
};

export type TypeLocation = 'COUNTRY' | 'REGION';

export type TransactionsFilter = {
  fromDate?: string;
  toDate?: string;
};
