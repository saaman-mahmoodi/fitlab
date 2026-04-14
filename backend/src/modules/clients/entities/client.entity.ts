import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Coach } from '../../coaches/entities/coach.entity';
import { Workout } from '../../workouts/entities/workout.entity';

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coach_id: string;

  @ManyToOne(() => Coach, (coach) => coach.clients)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @Column()
  user_id: string;

  @OneToOne(() => User, (user) => user.client)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  goals: {
    weight_goal?: number;
    fitness_goal?: string;
    target_date?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  metrics: {
    current_weight?: number;
    height?: number;
    age?: number;
    gender?: string;
  };

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({
    type: 'enum',
    enum: ClientStatus,
    default: ClientStatus.ACTIVE,
  })
  status: ClientStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Workout, (workout) => workout.client)
  workouts: Workout[];
}
