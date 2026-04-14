import { api } from './client';
import type { Workout } from '@/types';

export interface AiWorkoutResponse {
  title: string;
  notes: string;
  sets: {
    exercise_name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration_seconds?: number;
    notes?: string;
  }[];
}

export interface AiSummaryResponse {
  summary: string;
  recommendations: string[];
}

export const aiApi = {
  generateWorkout: (data: { client_id: string; goals: string; preferences?: string; duration_minutes?: number; difficulty?: string }) =>
    api.post<{ success: boolean; data: { workout: Workout; ai_suggestions: string[] } }>('/ai/generate-workout', data),
  adjustWorkout: (data: { workout_id: string; adjustment: string }) =>
    api.post<{ success: boolean; data: Workout }>('/ai/adjust-workout', data),
  progressSummary: (data: { client_id: string; period: string }) =>
    api.post<{ success: boolean; data: AiSummaryResponse }>('/ai/progress-summary', data),
  chat: (message: string, context?: string) =>
    api.post<{ success: boolean; data: { response: string } }>('/ai/chat', { message, context }),
};