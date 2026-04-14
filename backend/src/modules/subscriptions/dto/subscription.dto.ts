import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { SubscriptionPlan } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsOptional()
  @IsString()
  stripe_subscription_id?: string;

  @IsOptional()
  @IsString()
  stripe_price_id?: string;

  @IsOptional()
  @IsDateString()
  trial_end_date?: string;
}

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;

  @IsOptional()
  @IsString()
  stripe_subscription_id?: string;

  @IsOptional()
  @IsString()
  stripe_price_id?: string;
}