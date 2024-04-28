import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOccurrencePayload } from '../models/create-occurrence.payload';
import { UpdateOccurrencePayload } from '../models/update-occurrence.payload';
import { InjectRepository } from '@nestjs/typeorm';
import { OccurrenceEntity } from '../entities/occurrence.entity';
import { Like, Repository } from "typeorm";
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class OccurrencesService {
  constructor(
    @InjectRepository(OccurrenceEntity)
    private readonly repository: Repository<OccurrenceEntity>,
  ) {}

  public getRepository(): Repository<OccurrenceEntity> {
    return this.repository;
  }

  public async create(
    requestUser: UserEntity,
    createOccurrenceDto: CreateOccurrencePayload,
  ): Promise<OccurrenceEntity> {
    const occurrence = new OccurrenceEntity();

    occurrence.userId = requestUser.id;
    occurrence.title = createOccurrenceDto.title;
    occurrence.description = createOccurrenceDto.description;
    occurrence.type = createOccurrenceDto.type;
    occurrence.location = createOccurrenceDto.location;
    occurrence.photoUrl = createOccurrenceDto.photoUrl;

    return await this.repository.save(occurrence);
  }

  public async findAll(
    requestUser: UserEntity,
    search: string,
  ): Promise<OccurrenceEntity[]> {
    return await this.repository.find({
      order: {
        title: 'ASC',
      },
      where: search ? { title: Like('%' + search + '%') } : {},
    });
  }

  public async findOne(id: number): Promise<OccurrenceEntity> {
    const occurrence = await this.repository.findOneBy({ id });

    if (!occurrence)
      throw new NotFoundException('A ocorrência não foi encontrado');

    return occurrence;
  }

  public async update(
    id: number,
    updateOccurrenceDto: UpdateOccurrencePayload,
  ) {
    return `This action updates a #${id} occurrence`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} occurrence`;
  }
}
