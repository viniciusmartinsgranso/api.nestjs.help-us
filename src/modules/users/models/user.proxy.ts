import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserEntity } from '../entities/user.entity';
import { GetManyDefaultResponseProxy } from '../../../common/proxies/get-many-default-response.proxy';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { OccurrenceProxy } from "../../occurrences/models/occurrence.proxy";

export class UserProxy {
  constructor(entity: UserEntity) {
    this.id = entity.id;
    this.isActive = entity.isActive;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.name = entity.name;
    this.email = entity.email;
    this.city = entity.city;
    this.roles = entity.roles;
  }

  @ApiProperty({ type: Number })
  public id: number;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty({ default: true, type: Boolean })
  public isActive: boolean;

  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String, example: 'vini.martins@email.com' })
  public email!: string;

  @ApiProperty({ type: String })
  public city!: string;

  @ApiProperty({ type: String })
  public password!: string;

  @ApiProperty()
  public roles: RolesEnum[];

  @ApiPropertyOptional({ isArray: true })
  public occurrences?: OccurrenceProxy[];
}

export class GetManyDefaultResponseUserProxy extends GetManyDefaultResponseProxy {
  @ApiProperty({ type: () => UserProxy, isArray: true })
  data!: UserProxy[];
}
