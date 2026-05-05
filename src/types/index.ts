// Web Portal Types
export interface User {
  id: string;
  username?: string;
  email: string;
  role: 'admin' | 'analyst';
  github_id?: string;
  avatar_url?: string;
}

export interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at?: string;
}

export interface FilterOptions {
  gender?: string;
  country_id?: string;
  age_group?: string;
  min_age?: number;
  max_age?: number;
  page?: number;
  limit?: number;
}

export interface APIResponse<T> {
  data?: T | T[];
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
  links?: {
    self: string;
    next: string | null;
    prev: string | null;
  };
  message?: string;
  status?: string;
}
