import { ResidenceEntity } from '../entities/residence.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserProxy } from '../../users/models/user.proxy';

export class ResidenceProxy {
  constructor(entity: ResidenceEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.isActive = entity.isActive;
    this.name = entity.name;
    this.latitude = entity.latitude;
    this.longitude = entity.longitude;
    this.user = entity.user;
  }

  @ApiProperty({ type: Number })
  public id: number;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty({ default: true, type: Boolean })
  public isActive: boolean;

  @ApiProperty({ type: String, nullable: false })
  public name: string;

  @ApiProperty({ nullable: false, type: Number })
  public longitude: number;

  @ApiProperty({ nullable: false, type: Number })
  public latitude: number;

  @ApiProperty({ nullable: false, type: UserProxy })
  public user: UserProxy;
}
