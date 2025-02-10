import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResidencePayload } from '../models/create-residence.payload';
import { UpdateResidenceProxy } from '../models/update-residence.proxy';
import { InjectRepository } from '@nestjs/typeorm';
import { ResidenceEntity } from '../entities/residence.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { RolesEnum } from '../../../common/enums/roles.enum';

@Injectable()
export class ResidenceService {
  constructor(
    @InjectRepository(ResidenceEntity)
    private readonly repository: Repository<ResidenceEntity>,
  ) {
  }

  public async create(
    createResidenceDto: CreateResidencePayload,
    requestUser: UserEntity,
  ): Promise<ResidenceEntity> {
    const entity = this.repository.findOneBy({
      userId: requestUser.id,
      name: createResidenceDto.name,
    });
    
    if (entity)
      throw new ForbiddenException('Já possui uma residencia com esse nome.');
    
    const residence = this.repository.create({
      ...createResidenceDto,
      userId: requestUser.id,
    });
    
    return this.repository.save(residence);
  }

  public async findAll(
    search: string,
    requestUser: UserEntity,
  ): Promise<ResidenceEntity[]> {
    if (requestUser.roles.includes(RolesEnum.NONE))
      throw new BadRequestException(
        'Você não possui permissão para acessar essa página.');
    
    const residences = await this.repository.find({
      where: {
        userId: requestUser.id,
        ...(search && {
          name: search,
        }),
      },
      relations: ['user'],
    });
    
    if (!residences.length)
      throw new NotFoundException('Você não possui residências cadastradas.');

    return residences;
  }

  findOne(id: number) {
    return `This action returns a #${id} residence`;
  }

  update(id: number, updateResidenceDto: UpdateResidenceProxy) {
    return `This action updates a #${id} residence`;
  }

  remove(id: number) {
    return `This action removes a #${id} residence`;
  }
}
