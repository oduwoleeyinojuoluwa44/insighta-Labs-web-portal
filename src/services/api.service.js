import axios from 'axios';
// Use backend root; routes will use /api/v1/* auth endpoints
const API_URL = import.meta.env.VITE_API_URL || 'https://data-persistence-api-psi.vercel.app';
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
            },
        });
        // Add CSRF token to mutation requests
        this.client.interceptors.request.use((config) => {
            if (['POST', 'PUT', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                if (csrfToken) {
                    config.headers['X-CSRF-Token'] = csrfToken;
                }
            }
            return config;
        });
        // Handle token refresh on 401
        this.client.interceptors.response.use((response) => response, async (error) => {
            if (error.response?.status === 401) {
                try {
                    await this.refreshToken();
                    // Retry original request
                    if (error.config) {
                        return this.client(error.config);
                    }
                }
                catch (refreshError) {
                    // Redirect to login on refresh failure
                    window.location.href = '/login';
                }
            }
            return Promise.reject(error);
        });
    }
    async getAuthorizationUrl() {
        const response = await this.client.get('/api/v1/auth/github');
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
        // Use legacy endpoint (Stage 2 compatible, same functionality as v1)
        const response = await this.client.get('/api/profiles', {
            params: filters,
        });
        const data = response.data?.data_list || response.data?.data || [];
        return Array.isArray(data) ? data : [data];
    }
    async searchProfiles(query, filters = {}) {
        // Use legacy endpoint (Stage 2 compatible, same functionality as v1)
        const response = await this.client.get('/api/profiles/search', {
            params: { q: query, ...filters },
        });
        const data = response.data?.data_list || response.data?.data || [];
        return Array.isArray(data) ? data : [data];
    }
    async getProfile(id) {
        const response = await this.client.get(`/api/profiles/${id}`);
        return response.data?.data || response.data;
    }
    async exportProfiles(filters = {}) {
        const response = await this.client.get('/api/profiles/1/export', {
            params: filters,
            responseType: 'blob',
        });
        return response.data;
    }
}
export const apiService = new APIService();
