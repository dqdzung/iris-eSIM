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

export type ApiResponse = {
  data: any;
  success?: boolean;
  message?: string;
};

export type AuthenticateResponseData = { loginToken: string };
export type VerifySessionResponseData = {
  customer: any;
  expireInMinutes: number;
  sessionToken: string;
};
