import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { Automation } from '../../automations/entities/automation.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Entity('coaches')
export class Coach {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @OneToOne(() => User, (user) => user.coach)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  business_name: string;

  @Column({ type: 'jsonb', nullable: true })
  custom_branding: {
    primary_color?: string;
    secondary_color?: string;
    logo_url?: string;
  };

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Client, (client) => client.coach)
  clients: Client[];

  @OneToMany(() => Automation, (automation) => automation.coach)
  automations: Automation[];

  @OneToOne(() => Subscription, (subscription) => subscription.coach)
  subscription: Subscription;
}
