import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResidenceService } from '../service/residence.service';
import { CreateResidencePayload } from '../models/create-residence.payload';
import { UpdateResidenceProxy } from '../models/update-residence.proxy';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { ResidenceProxy } from '../models/residence.proxy';
import { User } from '../../../decorators/user/user.decorator';
import { UserEntity } from '../../users/entities/user.entity';

@ApiTags('Occurrences')
@Controller('residences')
export class ResidenceController {
  constructor(private readonly residenceService: ResidenceService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova residência' })
  @ApiOkResponse({ type: ResidenceProxy })
  @ProtectTo(RolesEnum.USER, RolesEnum.ADMIN)
  public async create(
    @Body() createResidenceDto: CreateResidencePayload,
    @User() requestUser: UserEntity,
  ): Promise<ResidenceProxy> {
    return await this.residenceService
      .create(createResidenceDto, requestUser)
      .then((residence) => new ResidenceProxy(residence));
  }

  @Get()
  @ProtectTo()
  @ApiOperation({ summary: 'Obtém as residências' })
  @ApiOkResponse({ type: ResidenceProxy, isArray: true })
  @ApiQuery({
    name: 'search',
    description: 'A busca a ser realizada',
    required: false,
  })
  public async findAll(
    @User() requestUser: UserEntity,
    @Query('search') search: string,
  ): Promise<ResidenceProxy[]> {
    return await this.residenceService
      .findAll(search, requestUser)
      .then((residence) =>
        residence.map((entity) => new ResidenceProxy(entity)),
      );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residenceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResidenceDto: UpdateResidenceProxy) {
    return this.residenceService.update(+id, updateResidenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residenceService.remove(+id);
  }
}
