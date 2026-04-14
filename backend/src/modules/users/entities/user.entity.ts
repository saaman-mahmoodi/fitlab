import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Coach } from '../../coaches/entities/coach.entity';
import { Client } from '../../clients/entities/client.entity';

export enum UserRole {
  COACH = 'coach',
  CLIENT = 'client',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  stripe_customer_id: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Coach, (coach) => coach.user, { nullable: true })
  coach: Coach;

  @OneToOne(() => Client, (client) => client.user, { nullable: true })
  client: Client;
}
