import { IsString, IsOptional, IsObject, IsUrl } from 'class-validator';

export class UpdateCoachDto {
  @IsOptional()
  @IsString()
  business_name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsObject()
  custom_branding?: {
    primary_color?: string;
    secondary_color?: string;
    logo_url?: string;
  };

  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}