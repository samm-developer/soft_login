import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  // Null for accounts that only sign in with Microsoft.
  @Column({ type: 'varchar', nullable: true, select: false })
  password: string | null;

  // Microsoft Entra object id (`oid` claim) for accounts linked to Microsoft.
  @Column({ type: 'varchar', nullable: true, unique: true })
  microsoftId: string | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
