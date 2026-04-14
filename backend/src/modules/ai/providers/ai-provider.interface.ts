export interface AiProvider {
  name: string;
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
  generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T>;
}

export interface AiWorkoutPlan {
  title: string;
  weeks: number;
  days_per_week: number;
  difficulty: string;
  workouts: {
    day: number;
    name: string;
    exercises: {
      exercise_name: string;
      category: string;
      sets: number;
      reps: number;
      weight?: number;
      rir?: number;
      notes?: string;
    }[];
  }[];
}