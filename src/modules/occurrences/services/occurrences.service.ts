import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOccurrencePayload } from "../models/create-occurrence.payload";
import { UpdateOccurrencePayload } from "../models/update-occurrence.payload";
import { InjectRepository } from "@nestjs/typeorm";
import { OccurrenceEntity } from "../entities/occurrence.entity";
import { Repository } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

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
    const occurrence = this.repository.create({
      ...createOccurrenceDto,
      userId: requestUser.id,
    });

    return await this.repository.save(occurrence);
  }

  public async findAll(
    requestUser: UserEntity,
    latitude: number,
    longitude: number,
    search?: string,
  ): Promise<OccurrenceEntity[]> {
    const radius = 5 * 1000; // 12 km in meters

    const query = this.repository
      .createQueryBuilder('occurrence')
      .where(
        `ST_DistanceSphere(
          ST_MakePoint(:userLongitude, :userLatitude),
          ST_MakePoint(occurrence.longitude, occurrence.latitude)
        ) <= :radius`,
        { userLongitude: longitude, userLatitude: latitude, radius },
      );

    if (search) {
      query.andWhere('occurrence.title LIKE :search', { search: `%${search}%` });
    }

    query.orderBy('occurrence.title', 'ASC');

    return await query.getMany();
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

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Distância em km
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
