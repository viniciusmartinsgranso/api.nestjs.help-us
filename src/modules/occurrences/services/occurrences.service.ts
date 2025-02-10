import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOccurrencePayload } from '../models/create-occurrence.payload';
import { UpdateOccurrencePayload } from '../models/update-occurrence.payload';
import { InjectRepository } from '@nestjs/typeorm';
import { OccurrenceEntity } from '../entities/occurrence.entity';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { NotificationService } from '../../notification/service/notification.service';

@Injectable()
export class OccurrencesService {
  constructor(
    @InjectRepository(OccurrenceEntity)
    private readonly repository: Repository<OccurrenceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly notificationService: NotificationService,
  ) {}

  public getRepository(): Repository<OccurrenceEntity> {
    return this.repository;
  }

  public async create(
    requestUser: UserEntity,
    createOccurrenceDto: CreateOccurrencePayload,
  ): Promise<OccurrenceEntity> {
    if (requestUser.roles.includes(RolesEnum.NONE))
      throw new ForbiddenException(
        'Usuário não possui permissão para criar uma ocorrência.',
      );

    const occurrence = this.repository.create({
      ...createOccurrenceDto,
      userId: requestUser.id,
      user: requestUser,
    });

    const user = await this.userRepository.findOne({
      where: { id: requestUser.id },
      relations: ['residences'],
    });

    for (const residence of user.residences) {
      const distance = this.calculateDistance(
        residence.latitude,
        residence.longitude,
        occurrence.latitude,
        occurrence.longitude,
      );

      if (distance <= 2)
        await this.notificationService.notifyUser(user, occurrence, residence);
    }

    return await this.repository.save(occurrence);
  }

  public async findAll(
    requestUser: UserEntity,
    latitude: number,
    longitude: number,
    search?: string,
  ): Promise<OccurrenceEntity[]> {
    const radius = 12 * 1000; // 12 km in meters

    const occurrences = await this.repository.find({
      where: {
        ...(search && { title: Like(`%${search}%`) }),
        isActive: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    const filteredOccurrences = occurrences.filter((occurrence) => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        occurrence.latitude,
        occurrence.longitude,
      );
      return distance <= radius;
    });

    const currentDate = new Date();
    for (const occurrence of filteredOccurrences) {
      const timeDifference =
        currentDate.getTime() - occurrence.updatedAt.getTime();
      if (timeDifference > 10800000) {
        occurrence.isActive = false;
        await this.repository.save(occurrence);
      }
    }

    return filteredOccurrences;
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

  public async getUserOccurrences(
    requestUser: UserEntity,
  ): Promise<OccurrenceEntity[]> {
    return await this.repository.findBy({
      userId: requestUser.id,
    });
  }

  //#endregion

  //#region Private Methods

  private calculateDistance(
    userLat: number,
    userLong: number,
    occurrenceLat: number,
    occurrenceLog: number,
  ): number {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const earthRadius = 6371e3;
    const phi1 = toRadians(occurrenceLat);
    const phi2 = toRadians(userLat);
    const deltaPhi = toRadians(userLat - occurrenceLat);
    const deltaLambda = toRadians(userLong - occurrenceLog);

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  //#endergion
}
