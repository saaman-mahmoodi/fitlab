import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUrl,
} from 'class-validator';
import { ExerciseCategory, Equipment } from '../entities/exercise.entity';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsEnum(ExerciseCategory)
  category: ExerciseCategory;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsUrl()
  video_url?: string;

  @IsOptional()
  @IsUrl()
  thumbnail_url?: string;

  @IsOptional()
  @IsEnum(Equipment)
  equipment?: Equipment;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  muscle_groups?: string[];
}

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ExerciseCategory)
  category?: ExerciseCategory;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsUrl()
  video_url?: string;

  @IsOptional()
  @IsUrl()
  thumbnail_url?: string;

  @IsOptional()
  @IsEnum(Equipment)
  equipment?: Equipment;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  muscle_groups?: string[];
}