import { he } from 'zod/v4/locales';
import { HttpError } from './type';
import { fetch } from 'expo/fetch';

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

if (!baseUrl) throw new Error('EXPO_BASE_URL environment variable is not set');

const buildUrl = (endpoint: string) => `${baseUrl}/api/v1/${endpoint}`;

class ApiService {
  private controllers: Map<string, AbortController> = new Map();
  /**
   * Fetches data from the specified URL.
   * @template T The expected type of the response data.
   * @param {string} url The URL to fetch data from.
   * @param {string} options.requestId - A unique identifier for the request, used for cancellation.
   * @returns {Promise<T>} A promise that resolves with the fetched data or rejects with an error.
   */
  public async fetchData<T>(
    url: string,
    {
      requestId = url,
      method = 'GET',
      ...options
    }: RequestInit & {
      requestId?: string;
    }
  ): Promise<T> {
    const controller = new AbortController();
    if (requestId) {
      // Abort any existing request with the same ID before starting a new one
      this.abortRequest(requestId);
      this.controllers.set(requestId, controller);
    }

    try {
      let requestBody = options?.body;
      const isFormData = options.body instanceof FormData;

      const headers: any = {
        ...options.headers,
        'Content-Type': 'application/json',
      };

      // Do not set Content-Type for FormData manually
      if (isFormData) {
        delete headers['Content-Type'];
      }

      // Automatic JSON stringification and Content-Type for specific methods if body is an object
      if (
        !isFormData &&
        requestBody !== undefined &&
        typeof requestBody === 'object' &&
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())
      ) {
        requestBody = JSON.stringify(requestBody);
      }

      const response = await fetch(buildUrl(url), {
        method,
        ...options,
        credentials: 'include',
        headers,
        body: requestBody ?? undefined,
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new HttpError('HTTP Error', {
          status: response.status,
          detail: data,
        });
      }
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`Request ${requestId || url} was aborted.`);
        throw new HttpError('Request Aborted', {
          status: -1,
          detail: { message: 'The request was aborted.' },
        });
      }
      const err = error as HttpError;
      const status = err.cause?.status;
      const detail = err.cause?.detail;
      throw new HttpError('HTTP Error', {
        status,
        detail,
      });
    } finally {
      if (requestId) this.controllers.delete(requestId);
    }
  }

  /**
   * Aborts a request by its unique ID.
   * @param requestId The unique identifier of the request to abort.
   */
  public abortRequest(requestId: string): void {
    const controller = this.controllers.get(requestId);
    if (controller) {
      controller.abort();
      this.controllers.delete(requestId);
      console.log(`Request ${requestId} aborted.`);
    }
  }

  /**
   * Aborts all ongoing requests.
   */
  public abortAllRequests(): void {
    this.controllers.forEach((controller, requestId) => {
      controller.abort();
      console.log(`Request ${requestId} aborted.`);
    });
    this.controllers.clear();
  }

  /**
   * Sends a POST request to the specified URL.
   * @template T The expected type of the response data.
   * @param {string} url - The URL to send the POST request to.
   * @param {any} body - The request body.
   * @returns {Promise<T>} A promise that resolves with the response data.
   */
  public async post<T>(url: string, body?: any): Promise<T> {
    return this.fetchData<T>(url, {
      method: 'POST',
      body,
    });
  }

  /**
   * Sends a PATCH request to the specified URL.
   * @template T The expected type of the response data.
   * @param {string} url - The URL to send the PATCH request to.
   * @param {any} body - The request body.
   * @returns {Promise<T>} A promise that resolves with the response data.
   */
  public async patch<T>(url: string, body: any): Promise<T> {
    return this.fetchData<T>(url, {
      method: 'PATCH',
      body,
    });
  }

  /**
   * Sends a PUT request to the specified URL.
   * @template T The expected type of the response data.
   * @param {string} url - The URL to send the PUT request to.
   * @param {any} body - The request body.
   * @returns {Promise<T>} A promise that resolves with the response data.
   */
  public async put<T>(url: string, body?: any): Promise<T> {
    return this.fetchData<T>(url, {
      method: 'PUT',
      body,
    });
  }

  /**
   * Sends a GET request to the specified URL.
   * @template T The expected type of the response data.
   * @param {string} url - The URL to send the GET request to.
   * @returns {Promise<T>} A promise that resolves with the response data.
   */
  public async get<T>(url: string): Promise<T> {
    return this.fetchData<T>(url, {
      method: 'GET',
    });
  }

  /**
   * Sends a DELETE request to the specified URL.
   * @template T The expected type of the response data.
   * @param {string} url The URL to send the DELETE request to.
   * @param {any} body - The request body
   * @returns {Promise<T>} A promise that resolves with the response data.
   */
  public async delete<T>(url: string, body: any): Promise<T> {
    return this.fetchData<T>(url, { method: 'DELETE', body });
  }
}

export default ApiService;
