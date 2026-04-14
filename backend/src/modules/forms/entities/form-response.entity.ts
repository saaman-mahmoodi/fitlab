import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Form } from './form.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('form_responses')
export class FormResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  form_id: string;

  @ManyToOne(() => Form, (form) => form.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @Column()
  client_id: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ type: 'jsonb' })
  answers: Record<string, unknown>;

  @CreateDateColumn()
  created_at: Date;
}