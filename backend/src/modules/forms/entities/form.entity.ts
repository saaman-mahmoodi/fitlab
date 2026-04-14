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
import { Coach } from '../../coaches/entities/coach.entity';
import { FormResponse } from './form-response.entity';

export enum FormStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

@Entity('forms')
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coach_id: string;

  @ManyToOne(() => Coach, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  fields: {
    id: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'scale';
    label: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    min_value?: number;
    max_value?: number;
  }[];

  @Column({
    type: 'enum',
    enum: FormStatus,
    default: FormStatus.DRAFT,
  })
  status: FormStatus;

  @OneToMany(() => FormResponse, (response) => response.form)
  responses: FormResponse[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}