import { api } from './client';
import type { TrainingGroup } from '@/types';

export const groupsApi = {
  list: () =>
    api.get<TrainingGroup[]>('/groups'),
  get: (id: string) =>
    api.get<TrainingGroup>(`/groups/${id}`),
  create: (data: { name: string; description?: string; member_ids?: string[] }) =>
    api.post<TrainingGroup>('/groups', data),
  update: (id: string, data: Partial<TrainingGroup>) =>
    api.put<TrainingGroup>(`/groups/${id}`, data),
  delete: (id: string) =>
    api.delete<{ message: string }>(`/groups/${id}`),
  addMembers: (id: string, clientIds: string[]) =>
    api.post<TrainingGroup>(`/groups/${id}/members`, { client_ids: clientIds }),
  removeMembers: (id: string, clientIds: string[]) =>
    api.post<TrainingGroup>(`/groups/${id}/members/remove`, { client_ids: clientIds }),
};