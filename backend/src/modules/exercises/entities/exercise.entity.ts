import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ExerciseCategory {
  CHEST = 'chest',
  BACK = 'back',
  SHOULDERS = 'shoulders',
  ARMS = 'arms',
  LEGS = 'legs',
  CORE = 'core',
  CARDIO = 'cardio',
  FULL_BODY = 'full_body',
}

export enum Equipment {
  BARBELL = 'barbell',
  DUMBBELL = 'dumbbell',
  KETTLEBELL = 'kettlebell',
  CABLE = 'cable',
  MACHINE = 'machine',
  BODYWEIGHT = 'bodyweight',
  BAND = 'band',
  OTHER = 'other',
}

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ExerciseCategory,
  })
  category: ExerciseCategory;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ nullable: true })
  video_url: string;

  @Column({ nullable: true })
  thumbnail_url: string;

  @Column({
    type: 'enum',
    enum: Equipment,
    nullable: true,
  })
  equipment: Equipment;

  @Column({ type: 'simple-array', nullable: true })
  muscle_groups: string[];

  @Column({ default: false })
  is_custom: boolean;

  @Column({ nullable: true })
  created_by_coach_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
