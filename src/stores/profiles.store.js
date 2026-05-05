import { create } from 'zustand';
export const useProfilesStore = create((set) => ({
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
    addProfile: (profile) => set((state) => ({ profiles: [profile, ...state.profiles] })),
    removeProfile: (id) => set((state) => ({
        profiles: state.profiles.filter((p) => p.id !== id),
    })),
}));
