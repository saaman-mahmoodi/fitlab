import { api } from './client';
import type { Subscription, SubscriptionPlanInfo } from '@/types';

export const subscriptionsApi = {
  getPlans: () =>
    api.get<SubscriptionPlanInfo[]>('/subscriptions/plans'),
  getMySubscription: () =>
    api.get<Subscription | null>('/subscriptions/me'),
  create: (data: { plan: string }) =>
    api.post<Subscription>('/subscriptions', data),
  update: (id: string, data: { plan?: string }) =>
    api.put<Subscription>(`/subscriptions/${id}`, data),
  cancel: () =>
    api.delete<Subscription>('/subscriptions/me'),
};