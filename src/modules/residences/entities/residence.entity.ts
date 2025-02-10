import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('residence')
export class ResidenceEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({ nullable: false, default: true })
  public isActive: boolean;

  @Column({ nullable: false, length: 128 })
  public name: string;

  @Column({ nullable: false, type: 'float' })
  public latitude: number;

  @Column({ nullable: false, type: 'float' })
  public longitude: number;

  @Column({ nullable: false })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.residences)
  public user: UserEntity;
}
