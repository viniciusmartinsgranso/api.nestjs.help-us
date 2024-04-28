import { OccurrenceEntity } from '../entities/occurrence.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OccurrenceTypeEnum } from '../../users/models/occurrence-type.enum';
import { GetManyDefaultResponseProxy } from '../../../common/proxies/get-many-default-response.proxy';

export class OccurrenceProxy {
  constructor(entity: OccurrenceEntity) {
    this.id = entity.id;
    this.isActive = entity.isActive;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.title = entity.title;
    this.description = entity.description;
    this.type = entity.type;
    this.location = entity.location;
    this.userId = entity.userId;
    this.photoUrl = entity.photoUrl;
  }

  @ApiProperty({ type: Number })
  public id: number;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty({ default: true, type: Boolean })
  public isActive: boolean;

  @ApiProperty({ nullable: false })
  public title: string;

  @ApiProperty({ nullable: false })
  public description: string;

  @ApiProperty({ nullable: false })
  public location: string;

  @ApiProperty({ enum: OccurrenceTypeEnum, nullable: false })
  public type: OccurrenceTypeEnum;

  @ApiProperty({ nullable: false })
  public userId: number;

  @ApiPropertyOptional({ nullable: true })
  public photoUrl?: string;
}

export class GetManyDefaultResponseOccurrenceProxy extends GetManyDefaultResponseProxy {
  @ApiProperty({ type: () => OccurrenceProxy, isArray: true })
  data!: OccurrenceProxy[];
}
