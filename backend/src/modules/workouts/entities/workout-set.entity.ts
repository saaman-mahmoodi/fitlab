import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Workout } from './workout.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('workout_sets')
export class WorkoutSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workout_id: string;

  @ManyToOne(() => Workout, (workout) => workout.sets)
  @JoinColumn({ name: 'workout_id' })
  workout: Workout;

  @Column()
  exercise_id: string;

  @ManyToOne(() => Exercise)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @Column()
  sets: number;

  @Column({ nullable: true })
  reps: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  weight: number;

  @Column({ nullable: true })
  rir: number; // Reps in reserve

  @Column({ type: 'int', nullable: true })
  duration_seconds: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
