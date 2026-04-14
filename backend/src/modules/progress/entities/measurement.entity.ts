import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('measurements')
export class Measurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  client_id: string;

  @ManyToOne(() => Client, (client) => client.id)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  type: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  value: number;

  @Column({ default: 'inches' })
  unit: string;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  created_at: Date;
}