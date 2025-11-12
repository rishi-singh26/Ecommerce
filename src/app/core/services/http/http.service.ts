import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | string[]>;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private httpClient = inject(HttpClient);
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  /**
   * Merge default headers with request-specific headers
   */
  private mergeHeaders(customHeaders?: Record<string, string>): HttpHeaders {
    const allHeaders = {
      ...this.defaultHeaders,
      ...customHeaders,
    };

    let httpHeaders = new HttpHeaders();
    Object.entries(allHeaders).forEach(([key, value]) => {
      httpHeaders = httpHeaders.set(key, value);
    });

    return httpHeaders;
  }

  /**
   * Build HttpParams from params object
   */
  private buildParams(params?: Record<string, string | number | boolean | string[]>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            httpParams = httpParams.append(key, String(v));
          });
        } else {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return httpParams;
  }

  /**
   * GET request
   * @param url - The endpoint URL
   * @param config - Optional configuration with headers and params
   * @returns Observable of the response data
   */
  get<T>(url: string, config?: HttpRequestConfig): Observable<T> {
    const headers = this.mergeHeaders(config?.headers);
    const params = this.buildParams(config?.params);

    return this.httpClient.get<T>(url, {
      headers,
      params,
    });
  }

  /**
   * POST request
   * @param url - The endpoint URL
   * @param body - Request body
   * @param config - Optional configuration with headers and params
   * @returns Observable of the response data
   */
  post<T>(url: string, body?: any, config?: HttpRequestConfig): Observable<T> {
    const headers = this.mergeHeaders(config?.headers);
    const params = this.buildParams(config?.params);

    return this.httpClient.post<T>(url, body, {
      headers,
      params,
    });
  }

  /**
   * PUT request (full update)
   * @param url - The endpoint URL
   * @param body - Request body
   * @param config - Optional configuration with headers and params
   * @returns Observable of the response data
   */
  put<T>(url: string, body?: any, config?: HttpRequestConfig): Observable<T> {
    const headers = this.mergeHeaders(config?.headers);
    const params = this.buildParams(config?.params);

    return this.httpClient.put<T>(url, body, {
      headers,
      params,
    });
  }

  /**
   * PATCH request (partial update)
   * @param url - The endpoint URL
   * @param body - Request body
   * @param config - Optional configuration with headers and params
   * @returns Observable of the response data
   */
  patch<T>(url: string, body?: any, config?: HttpRequestConfig): Observable<T> {
    const headers = this.mergeHeaders(config?.headers);
    const params = this.buildParams(config?.params);

    return this.httpClient.patch<T>(url, body, {
      headers,
      params,
    });
  }

  /**
   * DELETE request
   * @param url - The endpoint URL
   * @param config - Optional configuration with headers and params
   * @returns Observable of the response data
   */
  delete<T>(url: string, config?: HttpRequestConfig): Observable<T> {
    const headers = this.mergeHeaders(config?.headers);
    const params = this.buildParams(config?.params);

    return this.httpClient.delete<T>(url, {
      headers,
      params,
    });
  }

  /**
   * Set default headers (e.g., for adding auth tokens)
   * @param headers - Headers to merge with existing defaults
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };
  }

  /**
   * Clear all default headers and reset to base defaults
   */
  clearDefaultHeaders(): void {
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Remove a specific default header
   * @param key - Header key to remove
   */
  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  /**
   * Get current default headers
   * @returns Object containing all current default headers
   */
  getDefaultHeaders(): Record<string, string> {
    return { ...this.defaultHeaders };
  }
}

