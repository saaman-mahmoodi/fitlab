import { api } from './client';
import type { MealPlan, FoodLog, MacroSummary } from '@/types';

export const nutritionApi = {
  getMealPlans: (clientId: string) =>
    api.get<MealPlan[]>(`/nutrition/meal-plans/client/${clientId}`),
  getMealPlan: (id: string) =>
    api.get<MealPlan>(`/nutrition/meal-plans/${id}`),
  createMealPlan: (data: { client_id: string; name: string; start_date: string; description?: string; end_date?: string; daily_calories_target?: number; macro_targets?: object }) =>
    api.post<MealPlan>('/nutrition/meal-plans', data),
  updateMealPlan: (id: string, data: Partial<MealPlan>) =>
    api.put<MealPlan>(`/nutrition/meal-plans/${id}`, data),
  deleteMealPlan: (id: string) =>
    api.delete<{ message: string }>(`/nutrition/meal-plans/${id}`),
  getFoodLogs: (clientId: string, date?: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return api.get<FoodLog[]>(`/nutrition/food-logs/client/${clientId}?${params.toString()}`);
  },
  getMacroSummary: (clientId: string, date?: string) =>
    api.get<MacroSummary>(`/nutrition/food-logs/client/${clientId}/summary${date ? `?date=${date}` : ''}`),
  createFoodLog: (data: { client_id: string; date: string; meal_type: string; food_name: string; calories?: number; protein_g?: number; carbs_g?: number; fat_g?: number; fiber_g?: number; serving_size?: number; serving_unit?: string; notes?: string }) =>
    api.post<FoodLog>('/nutrition/food-logs', data),
  updateFoodLog: (id: string, data: Partial<FoodLog>) =>
    api.put<FoodLog>(`/nutrition/food-logs/${id}`, data),
  deleteFoodLog: (id: string) =>
    api.delete<{ message: string }>(`/nutrition/food-logs/${id}`),
};