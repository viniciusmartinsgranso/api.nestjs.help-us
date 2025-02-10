import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OccurrencesService } from '../services/occurrences.service';
import { CreateOccurrencePayload } from '../models/create-occurrence.payload';
import { UpdateOccurrencePayload } from '../models/update-occurrence.payload';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../../decorators/user/user.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { OccurrenceEntity } from '../entities/occurrence.entity';
import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { OccurrenceProxy } from '../models/occurrence.proxy';
import { RolesEnum } from "../../../common/enums/roles.enum";

@ApiTags('Occurrences')
@Controller('occurrences')
export class OccurrencesController {
  constructor(private readonly occurrencesService: OccurrencesService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova ocorrência' })
  @ApiOkResponse()
  @ProtectTo(RolesEnum.USER, RolesEnum.ADMIN)
  create(
    @User() requestUser: UserEntity,
    @Body() createOccurrenceDto: CreateOccurrencePayload,
  ): Promise<OccurrenceEntity> {
    return this.occurrencesService.create(requestUser, createOccurrenceDto);
  }

  @Get()
  @ProtectTo()
  @ApiOperation({ summary: 'Obtém as ocorrências' })
  @ApiOkResponse({ type: OccurrenceProxy, isArray: true })
  @ApiQuery({
    name: 'search',
    description: 'A busca a ser realizada',
    required: false,
  })
  public async findAll(
    @User() requestUser: UserEntity,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('search') search: string,
    @Query('startDate') search: Date,
    @Query('endDate') search: Date,
  ): Promise<OccurrenceProxy[]> {
    return this.occurrencesService
      .findAll(requestUser, latitude, longitude, search)
      .then((result) =>
      result.map((entity) => {
          entity.latitude = +entity.latitude;
        entity.longitude = +entity.longitude;
        return new OccurrenceProxy(entity);
      }),
    );
  }

  @ProtectTo()
  @Get('one/:id')
  @ApiOperation({ summary: 'Obtém os dados de uma ocorrência' })
  @ApiOkResponse({ type: OccurrenceProxy })
  public async findOne(@Param('id') id: number): Promise<OccurrenceProxy> {
    return this.occurrencesService.findOne(id);
  }

  @ProtectTo()
  @Get('me')
  @ApiOperation({ summary: 'Obtém as ocorrencias do usupario' })
  @ApiOkResponse({ type: OccurrenceProxy, isArray: true })
  public async findByUser(
    @User() requestUser: UserEntity,
  ): Promise<OccurrenceProxy[]> {
    return await this.occurrencesService
      .getUserOccurrences(requestUser)
      .then((result) => result.map((entity) => new OccurrenceProxy(entity)));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOccurrenceDto: UpdateOccurrencePayload,
  ) {
    return this.occurrencesService.update(+id, updateOccurrenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.occurrencesService.remove(+id);
  }
}
