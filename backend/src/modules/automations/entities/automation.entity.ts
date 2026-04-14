import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coach } from '../../coaches/entities/coach.entity';

export enum TriggerType {
  MISSED_WORKOUTS = 'missed_workouts',
  NO_WEIGHT_CHANGE = 'no_weight_change',
  PR_LOGGED = 'pr_logged',
  SCHEDULED_TIME = 'scheduled_time',
  CLIENT_MILESTONE = 'client_milestone',
}

export enum ActionType {
  SEND_MESSAGE = 'send_message',
  SEND_EMAIL = 'send_email',
  CREATE_TASK = 'create_task',
  UPDATE_CLIENT = 'update_client',
}

@Entity('automations')
export class Automation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coach_id: string;

  @ManyToOne(() => Coach, (coach) => coach.automations)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: TriggerType,
  })
  trigger: TriggerType;

  @Column({ type: 'jsonb' })
  condition: {
    threshold?: number;
    days?: number;
    metric?: string;
    comparison?: string;
  };

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  action: ActionType;

  @Column({ type: 'jsonb' })
  action_config: {
    message?: string;
    email_template?: string;
    task_title?: string;
    update_fields?: Record<string, any>;
  };

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  execution_count: number;

  @Column({ type: 'timestamp', nullable: true })
  last_executed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
