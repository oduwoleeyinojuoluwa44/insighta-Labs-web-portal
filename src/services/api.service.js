import axios from 'axios';
// Same-origin in production; Vercel rewrites /api/* to the backend.
const API_URL = import.meta.env.VITE_API_URL || '';
const AUTH_REFRESH_EXEMPT_PATHS = [
    '/api/v1/auth/github',
    '/api/v1/auth/github/callback',
    '/api/v1/auth/me',
    '/api/v1/auth/refresh',
    '/api/v1/auth/logout',
];
function shouldAttemptRefresh(config) {
    if (!config || config._retry)
        return false;
    const requestUrl = `${config.baseURL || ''}${config.url || ''}`;
    return !AUTH_REFRESH_EXEMPT_PATHS.some((path) => requestUrl.includes(path));
}
function normalizePagination(filters) {
    const legacyOffset = filters.offset;
    const { offset: _offset, ...cleanFilters } = filters;
    if (cleanFilters.page === undefined && typeof legacyOffset === 'number' && cleanFilters.limit) {
        return { ...cleanFilters, page: Math.floor(legacyOffset / cleanFilters.limit) + 1 };
    }
    return cleanFilters;
}
class APIService {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        this.client.interceptors.response.use((response) => response, async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && shouldAttemptRefresh(originalRequest)) {
                try {
                    originalRequest._retry = true;
                    await this.refreshToken();
                    return this.client(originalRequest);
                }
                catch {
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        });
    }
    async getAuthorizationUrl() {
        const response = await this.client.get('/api/v1/auth/github', {
            params: {
                redirect_uri: `${window.location.origin}/callback`,
                client: 'web',
            },
        });
        return response.data?.authorization_url;
    }
    async handleCallback(code, state) {
        const response = await this.client.get('/api/v1/auth/github/callback', {
            params: { code, state },
        });
        return response.data;
    }
    async refreshToken() {
        await this.client.post('/api/v1/auth/refresh', {});
    }
    async logout() {
        try {
            await this.client.post('/api/v1/auth/logout', {});
        }
        catch (error) {
            // Ignore errors on logout
        }
    }
    async getCurrentUser() {
        const response = await this.client.get('/api/v1/auth/me');
        return response.data?.data || response.data;
    }
    async getProfiles(filters = {}) {
        const response = await this.client.get('/api/v1/profiles', {
            params: normalizePagination(filters),
        });
        const data = response.data?.data || [];
        return Array.isArray(data) ? data : [data];
    }
    async searchProfiles(query, filters = {}) {
        const response = await this.client.get('/api/v1/profiles/search', {
            params: { q: query, ...normalizePagination(filters) },
        });
        const data = response.data?.data || [];
        return Array.isArray(data) ? data : [data];
    }
    async getProfile(id) {
        const response = await this.client.get(`/api/v1/profiles/${id}`);
        return response.data?.data || response.data;
    }
    async exportProfiles(filters = {}) {
        const response = await this.client.get('/api/v1/profiles/export', {
            params: { format: 'csv', ...normalizePagination(filters) },
            responseType: 'blob',
        });
        return response.data;
    }
}
export const apiService = new APIService();
