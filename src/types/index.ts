// Web Portal Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'analyst';
  github_id: string;
}

export interface Profile {
  id: number;
  first_name?: string;
  last_name?: string;
  gender?: string;
  age?: number;
  location?: string;
  occupation?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FilterOptions {
  gender?: string;
  location?: string;
  occupation?: string;
  age_min?: number;
  age_max?: number;
  limit?: number;
  offset?: number;
}

export interface APIResponse<T> {
  data?: T;
  data_list?: T[];
  error?: string;
  message?: string;
  status?: number;
}
