import { api } from './client';
import type { Form, FormResponse } from '@/types';

export const formsApi = {
  list: () =>
    api.get<Form[]>('/forms'),
  get: (id: string) =>
    api.get<Form>(`/forms/${id}`),
  getResponses: (id: string) =>
    api.get<FormResponse[]>(`/forms/${id}/responses`),
  create: (data: { title: string; description?: string; fields: object[]; status?: string }) =>
    api.post<Form>('/forms', data),
  update: (id: string, data: Partial<Form>) =>
    api.put<Form>(`/forms/${id}`, data),
  delete: (id: string) =>
    api.delete<{ message: string }>(`/forms/${id}`),
  publish: (id: string) =>
    api.post<Form>(`/forms/${id}/publish`),
  close: (id: string) =>
    api.post<Form>(`/forms/${id}/close`),
  submitResponse: (data: { form_id: string; client_id: string; answers: Record<string, unknown> }) =>
    api.post<FormResponse>('/forms/respond', data),
};