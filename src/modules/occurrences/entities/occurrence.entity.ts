import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { OccurrenceTypeEnum } from '../../users/models/occurrence-type.enum';

@Entity('occurrence')
export class OccurrenceEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ nullable: false, default: true })
  public isActive: boolean;

  @Column({ nullable: false, length: 128 })
  title!: string;

  @Column({ nullable: false, length: 256 })
  description!: string;

  @Column({ nullable: false, length: 128 })
  location!: string;

  @Column({ nullable: false, type: 'simple-array' })
  public type!: OccurrenceTypeEnum;

  @Column({ nullable: false })
  userId!: number;

  @Column({ nullable: true })
  photoUrl?: string;

  @ManyToOne(() => UserEntity, (user) => user.occurrences)
  public user: UserEntity;
}
