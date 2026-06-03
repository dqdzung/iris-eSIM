import type { CustomerCredentials } from './type';

// Dev fallback used when the partner URL doesn't include a credentials token.
// Delete this constant — and the `?? TEST_CREDS` below — once the deployed
// flow always lands with `?token=<base64>` in the query string.
export const TEST_CREDS: CustomerCredentials = {
  customerId: 'TEST_CUST_001',
  name: 'Test User',
  mobile: '0901234567',
  email: 'test@example.com',
};

// Reads `?token=<base64 of JSON>` from the current URL and returns the
// decoded credentials. Returns null if the token is missing, not valid
// base64, not valid JSON, or doesn't have the expected shape.
export const readCustomerCredsFromUrl = (): CustomerCredentials | null => {
  if (typeof window === 'undefined') return null;
  const token = new URLSearchParams(window.location.search).get('token');
  if (!token) return null;
  try {
    const parsed = JSON.parse(atob(token));
    if (
      typeof parsed?.customerId === 'string' &&
      typeof parsed?.name === 'string' &&
      typeof parsed?.mobile === 'string' &&
      typeof parsed?.email === 'string'
    ) {
      return parsed as CustomerCredentials;
    }
    return null;
  } catch {
    return null;
  }
};
