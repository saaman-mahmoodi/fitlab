import { IsString, IsOptional, IsDateString, IsInt, IsObject, IsBoolean, IsEnum } from 'class-validator';

export class CreateMealPlanDto {
  @IsString()
  client_id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsInt()
  daily_calories_target?: number;

  @IsOptional()
  @IsObject()
  macro_targets?: {
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    fiber_g?: number;
  };

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateMealPlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsInt()
  daily_calories_target?: number;

  @IsOptional()
  @IsObject()
  macro_targets?: {
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    fiber_g?: number;
  };

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

export class CreateFoodLogDto {
  @IsString()
  client_id: string;

  @IsDateString()
  date: string;

  @IsEnum(MealType)
  meal_type: MealType;

  @IsString()
  food_name: string;

  @IsOptional()
  calories?: number;

  @IsOptional()
  protein_g?: number;

  @IsOptional()
  carbs_g?: number;

  @IsOptional()
  fat_g?: number;

  @IsOptional()
  fiber_g?: number;

  @IsOptional()
  serving_size?: number;

  @IsOptional()
  @IsString()
  serving_unit?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateFoodLogDto {
  @IsOptional()
  @IsEnum(MealType)
  meal_type?: MealType;

  @IsOptional()
  @IsString()
  food_name?: string;

  @IsOptional()
  calories?: number;

  @IsOptional()
  protein_g?: number;

  @IsOptional()
  carbs_g?: number;

  @IsOptional()
  fat_g?: number;

  @IsOptional()
  fiber_g?: number;

  @IsOptional()
  serving_size?: number;

  @IsOptional()
  @IsString()
  serving_unit?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}