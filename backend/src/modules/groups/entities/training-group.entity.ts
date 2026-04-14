import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Coach } from '../../coaches/entities/coach.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('training_groups')
export class TrainingGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coach_id: string;

  @ManyToOne(() => Coach, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Client, { cascade: true })
  @JoinTable({
    name: 'training_group_members',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'client_id', referencedColumnName: 'id' },
  })
  members: Client[];

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}