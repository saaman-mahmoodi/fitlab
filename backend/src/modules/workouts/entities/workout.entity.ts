import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { WorkoutSet } from './workout-set.entity';

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  client_id: string;

  @ManyToOne(() => Client, (client) => client.workouts)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  title: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  generated_by_ai: boolean;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    duration_minutes?: number;
    difficulty?: string;
    category?: string;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => WorkoutSet, (set) => set.workout)
  sets: WorkoutSet[];
}
