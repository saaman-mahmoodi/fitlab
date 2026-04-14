import { IsString, IsOptional, IsNumber, IsObject, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateWorkoutDto {
  @IsString()
  @MinLength(3)
  fitness_goal: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  weeks?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  days_per_week?: number;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsObject()
  client_info?: {
    current_weight?: number;
    height?: number;
    age?: number;
    gender?: string;
    experience_level?: string;
    limitations?: string;
  };
}

export class AdjustWorkoutDto {
  @IsString()
  client_progress: string;

  @IsOptional()
  @IsString()
  current_workout?: string;

  @IsOptional()
  @IsString()
  specific_issue?: string;
}

export class GenerateSummaryDto {
  @IsOptional()
  @IsObject()
  weight_data?: { date: string; weight: number }[];

  @IsOptional()
  @IsObject()
  workout_compliance?: { week: string; completed: number; total: number }[];

  @IsOptional()
  @IsString()
  client_goals?: string;
}

export class AiChatDto {
  @IsString()
  @MinLength(1)
  message: string;

  @IsOptional()
  @IsString()
  context?: string;
}