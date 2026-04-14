import { create } from 'zustand';
import type { User } from '@/types';
import { api } from '@/lib/api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('fitlab_token') : null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const result = await response.json();
      const { access_token, user } = result.data || result;

      api.setToken(access_token);
      localStorage.setItem('fitlab_refresh_token', result.data?.refresh_token || result.refresh_token);

      set({ user, token: access_token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string, role?: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: role || 'coach' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const result = await response.json();
      const { access_token, user } = result.data || result;

      api.setToken(access_token);
      localStorage.setItem('fitlab_refresh_token', result.data?.refresh_token || result.refresh_token);

      set({ user, token: access_token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    api.setToken(null);
    localStorage.removeItem('fitlab_token');
    localStorage.removeItem('fitlab_refresh_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('fitlab_token');
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }

    api.setToken(token);
    set({ isLoading: true });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        api.setToken(null);
        localStorage.removeItem('fitlab_token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const result = await response.json();
      const user = result.data || result;
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));