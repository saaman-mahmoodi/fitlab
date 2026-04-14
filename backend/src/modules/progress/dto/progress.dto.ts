import { IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWeightLogDto {
  @IsNumber()
  @Type(() => Number)
  weight: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateMeasurementDto {
  @IsString()
  type: string;

  @IsNumber()
  @Type(() => Number)
  value: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsDateString()
  date: string;
}

export class CreateProgressPhotoDto {
  @IsString()
  photo_url: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  comparison_group?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}