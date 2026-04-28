import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    setUser: (user) => set({ user, isAuthenticated: true }),
    setAuthenticated: (auth) => set({ isAuthenticated: auth }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    logout: () => set({ user: null, isAuthenticated: false, error: null }),
}));
