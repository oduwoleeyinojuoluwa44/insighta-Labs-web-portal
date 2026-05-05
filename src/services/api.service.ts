import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Profile, FilterOptions, APIResponse } from '../types/index.js';

// Same-origin in production; Vercel rewrites /api/* to the backend.
const API_URL = import.meta.env.VITE_API_URL || '';

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const AUTH_REFRESH_EXEMPT_PATHS = [
  '/api/v1/auth/github',
  '/api/v1/auth/github/callback',
  '/api/v1/auth/me',
  '/api/v1/auth/refresh',
  '/api/v1/auth/logout',
];

function shouldAttemptRefresh(config?: RetryableRequestConfig): boolean {
  if (!config || config._retry) return false;

  const requestUrl = `${config.baseURL || ''}${config.url || ''}`;
  return !AUTH_REFRESH_EXEMPT_PATHS.some((path) => requestUrl.includes(path));
}

function normalizePagination(filters: FilterOptions): FilterOptions {
  const legacyOffset = (filters as FilterOptions & { offset?: number }).offset;
  const { offset: _offset, ...cleanFilters } = filters as FilterOptions & { offset?: number };
  if (cleanFilters.page === undefined && typeof legacyOffset === 'number' && cleanFilters.limit) {
    return { ...cleanFilters, page: Math.floor(legacyOffset / cleanFilters.limit) + 1 };
  }
  return cleanFilters;
}

class APIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      withCredentials: true, // Send HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
        'X-API-Version': '1',
      },
    });

    // Add CSRF token to mutation requests
    this.client.interceptors.request.use((config) => {
      if (['POST', 'PUT', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
        const csrfToken = document.cookie
          .split('; ')
          .find((item) => item.startsWith('csrf_token='))
          ?.split('=')[1];
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = decodeURIComponent(csrfToken);
        }
      }
      return config;
    });

    // Handle token refresh on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;

        if (error.response?.status === 401 && shouldAttemptRefresh(originalRequest)) {
          try {
            originalRequest!._retry = true;
            await this.refreshToken();
            return this.client(originalRequest!);
          } catch {
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async getAuthorizationUrl(): Promise<string> {
    const response = await this.client.get('/api/v1/auth/github', {
      params: {
        redirect_uri: `${window.location.origin}/callback`,
        client: 'web',
      },
    });
    return response.data?.authorization_url;
  }

  async handleCallback(code: string, state: string): Promise<any> {
    const response = await this.client.get('/api/v1/auth/github/callback', {
      params: { code, state },
    });
    return response.data;
  }

  async refreshToken(): Promise<void> {
    await this.client.post('/api/v1/auth/refresh', {});
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/api/v1/auth/logout', {});
    } catch (error) {
      // Ignore errors on logout
    }
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.client.get('/api/v1/auth/me');
    return response.data?.data || response.data;
  }

  async getProfiles(filters: FilterOptions = {}): Promise<Profile[]> {
    const response = await this.client.get<APIResponse<Profile>>('/api/v1/profiles', {
      params: normalizePagination(filters),
    });
    const data = response.data?.data || [];
    return Array.isArray(data) ? data : [data];
  }

  async searchProfiles(query: string, filters: FilterOptions = {}): Promise<Profile[]> {
    const response = await this.client.get<APIResponse<Profile>>('/api/v1/profiles/search', {
      params: { q: query, ...normalizePagination(filters) },
    });
    const data = response.data?.data || [];
    return Array.isArray(data) ? data : [data];
  }

  async getProfile(id: string): Promise<Profile> {
    const response = await this.client.get<any>(`/api/v1/profiles/${id}`);
    return response.data?.data || response.data;
  }

  async exportProfiles(filters: FilterOptions = {}): Promise<Blob> {
    const response = await this.client.get('/api/v1/profiles/export', {
      params: { format: 'csv', ...normalizePagination(filters) },
      responseType: 'blob',
    });
    return response.data;
  }
}

export const apiService = new APIService();
