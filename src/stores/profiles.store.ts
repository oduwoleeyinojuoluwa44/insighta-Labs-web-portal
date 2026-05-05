import { create } from 'zustand';
import { Profile, FilterOptions } from '../types/index.js';

interface ProfilesState {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  total: number;
  setProfiles: (profiles: Profile[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: FilterOptions) => void;
  setTotal: (total: number) => void;
  addProfile: (profile: Profile) => void;
  removeProfile: (id: string) => void;
}

export const useProfilesStore = create<ProfilesState>((set) => ({
  profiles: [],
  loading: false,
  error: null,
  filters: { limit: 10, page: 1 },
  total: 0,
  setProfiles: (profiles) => set({ profiles }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  setTotal: (total) => set({ total }),
  addProfile: (profile) =>
    set((state) => ({ profiles: [profile, ...state.profiles] })),
  removeProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
    })),
}));
