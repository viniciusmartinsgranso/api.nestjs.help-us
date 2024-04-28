import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Query
} from "@nestjs/common";
import { OccurrencesService } from '../services/occurrences.service';
import { CreateOccurrencePayload } from '../models/create-occurrence.payload';
import { UpdateOccurrencePayload } from '../models/update-occurrence.payload';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { User } from '../../../decorators/user/user.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { OccurrenceEntity } from '../entities/occurrence.entity';
import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { OccurrenceProxy } from "../models/occurrence.proxy";
import { UserProxy } from "../../users/models/user.proxy";

@ApiTags('Occurrences')
@Controller('occurrences')
export class OccurrencesController {
  constructor(private readonly occurrencesService: OccurrencesService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova ocorrência' })
  @ApiOkResponse()
  @ProtectTo()
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
    @Query('search') search: string,
  ): Promise<OccurrenceProxy[]> {
    return this.occurrencesService
      .findAll(requestUser, search)
      .then((result) => result.map((entity) => new OccurrenceProxy(entity)));
  }

  @ProtectTo()
  @Get('one/:id')
  @ApiOperation({ summary: 'Obtém os dados de um usuário' })
  @ApiOkResponse({ type: OccurrenceProxy })
  public async findOne(@Param('id') id: number): Promise<OccurrenceProxy> {
    return this.occurrencesService.findOne(id);
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
