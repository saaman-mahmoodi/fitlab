import { IsString, IsEnum, IsObject, IsOptional, IsBoolean } from 'class-validator';
import { TriggerType, ActionType } from '../entities/automation.entity';

export class CreateAutomationDto {
  @IsString()
  name: string;

  @IsEnum(TriggerType)
  trigger: TriggerType;

  @IsObject()
  condition: {
    threshold?: number;
    days?: number;
    metric?: string;
    comparison?: string;
  };

  @IsEnum(ActionType)
  action: ActionType;

  @IsObject()
  action_config: {
    message?: string;
    email_template?: string;
    task_title?: string;
    update_fields?: Record<string, unknown>;
  };

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateAutomationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(TriggerType)
  trigger?: TriggerType;

  @IsOptional()
  @IsObject()
  condition?: {
    threshold?: number;
    days?: number;
    metric?: string;
    comparison?: string;
  };

  @IsOptional()
  @IsEnum(ActionType)
  action?: ActionType;

  @IsOptional()
  @IsObject()
  action_config?: {
    message?: string;
    email_template?: string;
    task_title?: string;
    update_fields?: Record<string, unknown>;
  };

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}