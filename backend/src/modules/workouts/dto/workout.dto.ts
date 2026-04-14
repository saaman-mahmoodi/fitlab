import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkoutSetDto {
  @IsUUID()
  exercise_id: string;

  @IsNumber()
  @Type(() => Number)
  sets: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  reps?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rir?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration_seconds?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutDto {
  @IsUUID()
  client_id: string;

  @IsString()
  title: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  generated_by_ai?: boolean;

  @IsOptional()
  metadata?: {
    duration_minutes?: number;
    difficulty?: string;
    category?: string;
  };

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutSetDto)
  sets?: CreateWorkoutSetDto[];
}

export class UpdateWorkoutDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  metadata?: {
    duration_minutes?: number;
    difficulty?: string;
    category?: string;
  };
}

export class AddWorkoutSetDto {
  @IsUUID()
  exercise_id: string;

  @IsNumber()
  @Type(() => Number)
  sets: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  reps?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rir?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration_seconds?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateWorkoutSetDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sets?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  reps?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rir?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration_seconds?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}