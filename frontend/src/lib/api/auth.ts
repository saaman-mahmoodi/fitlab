import { api } from './client';
import type { AuthResponse, User } from '@/types';

export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  refresh: (refreshToken: string) =>
    api.post<{ success: boolean; data: { access_token: string; refresh_token: string } }>('/auth/refresh', {
      refreshToken,
    }),

  getProfile: () =>
    api.get<{ success: boolean; data: User }>('/users/me'),

  updateProfile: (data: { name?: string; email?: string; avatar_url?: string }) =>
    api.put<{ success: boolean; data: User }>('/users/me', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<{ success: boolean; data: { message: string } }>('/users/me/password', data),
};