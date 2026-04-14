export interface User {
  id: string;
  email: string;
  name: string;
  role: 'coach' | 'client' | 'admin';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Coach {
  id: string;
  user_id: string;
  business_name?: string;
  bio?: string;
  phone?: string;
  website?: string;
  custom_branding?: {
    primary_color?: string;
    secondary_color?: string;
    logo_url?: string;
  };
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Client {
  id: string;
  coach_id: string;
  user_id: string;
  goals?: {
    weight_goal?: number;
    fitness_goal?: string;
    target_date?: string;
  };
  metrics?: {
    current_weight?: number;
    height?: number;
    age?: number;
    gender?: string;
  };
  tags?: string[];
  status: 'active' | 'inactive' | 'paused';
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  instructions?: string;
  video_url?: string;
  thumbnail_url?: string;
  equipment?: Equipment;
  muscle_groups?: string[];
  is_custom: boolean;
  created_by_coach_id?: string;
  created_at: string;
  updated_at: string;
}

export type ExerciseCategory = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio' | 'full_body';
export type Equipment = 'barbell' | 'dumbbell' | 'kettlebell' | 'cable' | 'machine' | 'bodyweight' | 'band' | 'other';

export interface Workout {
  id: string;
  client_id: string;
  title: string;
  date: string;
  notes?: string;
  generated_by_ai: boolean;
  completed: boolean;
  completed_at?: string;
  metadata?: {
    duration_minutes?: number;
    difficulty?: string;
    category?: string;
  };
  sets?: WorkoutSet[];
  client?: Client;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSet {
  id: string;
  workout_id: string;
  exercise_id: string;
  sets: number;
  reps?: number;
  weight?: number;
  rir?: number;
  duration_seconds?: number;
  notes?: string;
  completed: boolean;
  exercise?: Exercise;
  created_at: string;
  updated_at: string;
}

export interface WeightLog {
  id: string;
  client_id: string;
  weight: number;
  date: string;
  notes?: string;
  created_at: string;
}

export interface Measurement {
  id: string;
  client_id: string;
  type: string;
  value: number;
  unit: string;
  date: string;
  created_at: string;
}

export interface ProgressPhoto {
  id: string;
  client_id: string;
  photo_url: string;
  date: string;
  comparison_group?: string;
  notes?: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
  timestamp: string;
}

export interface Conversation {
  id: string;
  coach_id: string;
  client_id: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file';
  attachments?: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  }[];
  read: boolean;
  read_at?: string;
  timestamp: string;
  updated_at: string;
}

export type NotificationType = 'workout_assigned' | 'workout_completed' | 'message_received' | 'progress_update' | 'reminder' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp: string;
  path: string;
}