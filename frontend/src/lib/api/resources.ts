import { api } from './client';
import type { Client, Coach, PaginatedResponse, Workout, WorkoutSet, Exercise, WeightLog, Measurement, ProgressPhoto } from '@/types';

export const coachApi = {
  getProfile: () =>
    api.get<{ success: boolean; data: Coach }>('/coaches/me'),
  updateProfile: (data: { business_name?: string; bio?: string; phone?: string; website?: string }) =>
    api.put<{ success: boolean; data: Coach }>('/coaches/me', data),
};

export const clientApi = {
  list: (page = 1, limit = 20, search?: string) =>
    api.get<PaginatedResponse<Client>>(`/clients?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`),
  get: (id: string) =>
    api.get<{ success: boolean; data: Client }>(`/clients/${id}`),
  create: (data: { name: string; email: string; password: string; goals?: object; metrics?: object; tags?: string[]; notes?: string }) =>
    api.post<{ success: boolean; data: Client }>('/clients', data),
  update: (id: string, data: Partial<Client>) =>
    api.put<{ success: boolean; data: Client }>(`/clients/${id}`, data),
  deactivate: (id: string) =>
    api.delete<{ success: boolean; data: { message: string } }>(`/clients/${id}`),
};

export const exerciseApi = {
  list: (page = 1, limit = 50, search?: string, category?: string, equipment?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (equipment) params.set('equipment', equipment);
    return api.get<PaginatedResponse<Exercise>>(`/exercises?${params.toString()}`);
  },
  get: (id: string) =>
    api.get<{ success: boolean; data: Exercise }>(`/exercises/${id}`),
  create: (data: { name: string; category: string; instructions?: string; equipment?: string; muscle_groups?: string[] }) =>
    api.post<{ success: boolean; data: Exercise }>('/exercises', data),
  update: (id: string, data: Partial<Exercise>) =>
    api.put<{ success: boolean; data: Exercise }>(`/exercises/${id}`, data),
  delete: (id: string) =>
    api.delete<{ success: boolean; data: { message: string } }>(`/exercises/${id}`),
};

export const workoutApi = {
  list: (clientId: string, page = 1, limit = 20) =>
    api.get<PaginatedResponse<Workout>>(`/workouts?clientId=${clientId}&page=${page}&limit=${limit}`),
  get: (id: string) =>
    api.get<{ success: boolean; data: Workout }>(`/workouts/${id}`),
  create: (data: { client_id: string; title: string; date: string; notes?: string; sets?: Partial<WorkoutSet>[] }) =>
    api.post<{ success: boolean; data: Workout }>('/workouts', data),
  update: (id: string, data: Partial<Workout>) =>
    api.put<{ success: boolean; data: Workout }>(`/workouts/${id}`, data),
  delete: (id: string) =>
    api.delete<{ success: boolean; data: { message: string } }>(`/workouts/${id}`),
  addSet: (workoutId: string, data: Partial<WorkoutSet>) =>
    api.post<{ success: boolean; data: WorkoutSet }>(`/workouts/${workoutId}/sets`, data),
  updateSet: (setId: string, data: Partial<WorkoutSet>) =>
    api.put<{ success: boolean; data: WorkoutSet }>(`/workouts/sets/${setId}`, data),
  deleteSet: (setId: string) =>
    api.delete<{ success: boolean; data: { message: string } }>(`/workouts/sets/${setId}`),
};

export const progressApi = {
  logWeight: (clientId: string, data: { weight: number; date: string; notes?: string }) =>
    api.post<{ success: boolean; data: WeightLog }>(`/clients/${clientId}/progress/weight`, data),
  getWeight: (clientId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return api.get<{ success: boolean; data: WeightLog[] }>(`/clients/${clientId}/progress/weight?${params.toString()}`);
  },
  logMeasurement: (clientId: string, data: { type: string; value: number; unit?: string; date: string }) =>
    api.post<{ success: boolean; data: Measurement }>(`/clients/${clientId}/progress/measurements`, data),
  getMeasurements: (clientId: string, type?: string) =>
    api.get<{ success: boolean; data: Measurement[] }>(`/clients/${clientId}/progress/measurements${type ? `?type=${type}` : ''}`),
  addPhoto: (clientId: string, data: { photo_url: string; date: string; comparison_group?: string; notes?: string }) =>
    api.post<{ success: boolean; data: ProgressPhoto }>(`/clients/${clientId}/progress/photos`, data),
  getPhotos: (clientId: string) =>
    api.get<{ success: boolean; data: ProgressPhoto[] }>(`/clients/${clientId}/progress/photos`),
};