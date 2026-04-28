import { useAuthStore } from '../stores/auth.store.js';
import { useProfilesStore } from '../stores/profiles.store.js';
import { apiService } from '../services/api.service.js';
import { FilterOptions } from '../types/index.js';

export function useAuth() {
  const { user, isAuthenticated, loading, error, setUser, setAuthenticated, setLoading, setError, logout } =
    useAuthStore();

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const userData = await apiService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get user');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } finally {
      logout();
      window.location.href = '/';
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    getCurrentUser,
    logout: handleLogout,
    setError,
  };
}

export function useProfiles() {
  const { profiles, loading, error, filters, total, setProfiles, setLoading, setError, setFilters, setTotal } =
    useProfilesStore();

  const fetchProfiles = async (filterOptions?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProfiles(filterOptions || filters);
      setProfiles(data);
      setTotal(data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const searchProfiles = async (query: string, filterOptions?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.searchProfiles(query, filterOptions || filters);
      setProfiles(data);
      setTotal(data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const exportProfiles = async (filterOptions?: FilterOptions) => {
    try {
      const blob = await apiService.exportProfiles(filterOptions || filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profiles-${Date.now()}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  return {
    profiles,
    loading,
    error,
    filters,
    total,
    fetchProfiles,
    searchProfiles,
    exportProfiles,
    setFilters,
  };
}
