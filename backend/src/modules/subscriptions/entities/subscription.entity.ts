import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Coach } from '../../coaches/entities/coach.entity';

export enum SubscriptionPlan {
  STARTER = 'starter',
  GROWTH = 'growth',
  PRO = 'pro',
  ELITE = 'elite',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  TRIALING = 'trialing',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coach_id: string;

  @OneToOne(() => Coach, (coach) => coach.subscription)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
  })
  plan: SubscriptionPlan;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
  })
  status: SubscriptionStatus;

  @Column({ type: 'date' })
  renewal_date: Date;

  @Column({ nullable: true })
  stripe_subscription_id: string;

  @Column({ nullable: true })
  stripe_price_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'usd' })
  currency: string;

  @Column({ type: 'date', nullable: true })
  trial_end_date: Date;

  @Column({ type: 'date', nullable: true })
  canceled_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
