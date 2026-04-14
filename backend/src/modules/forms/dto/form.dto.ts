import { IsString, IsOptional, IsArray, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { FormStatus } from '../entities/form.entity';

export class FormFieldDto {
  @IsString()
  id: string;

  @IsString()
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'scale';

  @IsString()
  label: string;

  @IsOptional()
  required?: boolean;

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  min_value?: number;

  @IsOptional()
  max_value?: number;
}

export class CreateFormDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  fields: FormFieldDto[];

  @IsOptional()
  @IsEnum(FormStatus)
  status?: FormStatus;
}

export class UpdateFormDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  fields?: FormFieldDto[];

  @IsOptional()
  @IsEnum(FormStatus)
  status?: FormStatus;
}

export class SubmitFormResponseDto {
  @IsString()
  form_id: string;

  @IsString()
  client_id: string;

  @IsObject()
  answers: Record<string, unknown>;
}