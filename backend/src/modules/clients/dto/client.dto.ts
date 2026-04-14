import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsEmail,
  IsArray,
  MinLength,
} from 'class-validator';
import { ClientStatus } from '../entities/client.entity';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsObject()
  goals?: {
    weight_goal?: number;
    fitness_goal?: string;
    target_date?: string;
  };

  @IsOptional()
  @IsObject()
  metrics?: {
    current_weight?: number;
    height?: number;
    age?: number;
    gender?: string;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateClientDto {
  @IsOptional()
  @IsObject()
  goals?: {
    weight_goal?: number;
    fitness_goal?: string;
    target_date?: string;
  };

  @IsOptional()
  @IsObject()
  metrics?: {
    current_weight?: number;
    height?: number;
    age?: number;
    gender?: string;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}