import { create } from 'zustand';
import { User } from '../types/index.js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  setAuthenticated: (auth: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
