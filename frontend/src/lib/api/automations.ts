import { api } from './client';
import type { Automation } from '@/types';

export const automationsApi = {
  list: () =>
    api.get<Automation[]>('/automations'),
  get: (id: string) =>
    api.get<Automation>(`/automations/${id}`),
  create: (data: { name: string; trigger: string; condition: object; action: string; action_config: object; is_active?: boolean }) =>
    api.post<Automation>('/automations', data),
  update: (id: string, data: Partial<Automation>) =>
    api.put<Automation>(`/automations/${id}`, data),
  delete: (id: string) =>
    api.delete<{ message: string }>(`/automations/${id}`),
  toggle: (id: string) =>
    api.post<Automation>(`/automations/${id}/toggle`),
};