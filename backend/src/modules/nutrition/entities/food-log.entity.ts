import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('food_logs')
export class FoodLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  client_id: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  meal_type: string;

  @Column({ type: 'text' })
  food_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  calories: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  protein_g: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  carbs_g: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  fat_g: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  fiber_g: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  serving_size: number;

  @Column({ type: 'text', nullable: true })
  serving_unit: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;
}