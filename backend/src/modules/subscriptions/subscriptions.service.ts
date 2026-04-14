import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from './entities/subscription.entity';
import { CoachesService } from '../coaches/coaches.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';

const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.STARTER]: 0,
  [SubscriptionPlan.GROWTH]: 29,
  [SubscriptionPlan.PRO]: 59,
  [SubscriptionPlan.ELITE]: 99,
};

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    private coachesService: CoachesService,
  ) {}

  async findByCoachId(coachId: string): Promise<Subscription | null> {
    return this.subscriptionRepo.findOne({ where: { coach_id: coachId } });
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    const coach = await this.coachesService.findByUserId(userId);
    if (!coach) return null;
    return this.findByCoachId(coach.id);
  }

  async create(userId: string, dto: CreateSubscriptionDto): Promise<Subscription> {
    const coach = await this.coachesService.findByUserId(userId);
    const existing = await this.findByCoachId(coach.id);
    if (existing) {
      return this.update(existing.id, { plan: dto.plan });
    }

    const subscription = this.subscriptionRepo.create({
      coach_id: coach.id,
      plan: dto.plan,
      status: SubscriptionStatus.ACTIVE,
      amount: PLAN_PRICES[dto.plan],
      renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      trial_end_date: dto.trial_end_date ? new Date(dto.trial_end_date) : undefined,
      stripe_subscription_id: dto.stripe_subscription_id ?? undefined,
      stripe_price_id: dto.stripe_price_id ?? undefined,
    });

    return this.subscriptionRepo.save(subscription);
  }

  async update(id: string, dto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.subscriptionRepo.findOne({ where: { id } });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (dto.plan) {
      subscription.plan = dto.plan;
      subscription.amount = PLAN_PRICES[dto.plan];
    }
    if (dto.stripe_subscription_id !== undefined) subscription.stripe_subscription_id = dto.stripe_subscription_id;
    if (dto.stripe_price_id !== undefined) subscription.stripe_price_id = dto.stripe_price_id;

    return this.subscriptionRepo.save(subscription);
  }

  async cancel(userId: string): Promise<Subscription> {
    const subscription = await this.findByUserId(userId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    subscription.status = SubscriptionStatus.CANCELED;
    subscription.canceled_at = new Date();
    return this.subscriptionRepo.save(subscription);
  }

  async getPlans() {
    return Object.entries(PLAN_PRICES).map(([plan, price]) => ({
      plan,
      price,
      currency: 'usd',
    }));
  }
}