import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('progress_photos')
export class ProgressPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  client_id: string;

  @ManyToOne(() => Client, (client) => client.id)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  photo_url: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  comparison_group: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;
}