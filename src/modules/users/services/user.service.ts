import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserPayload } from '../models/create-user.payload';
import { UserProxy } from '../models/user.proxy';
import * as bcryptjs from 'bcryptjs';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { getCleanedString } from '../../../utils/utils/functions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  public getRepository(): Repository<UserEntity> {
    return this.repository;
  }

  public async getUsers(
    requestUser: UserEntity,
    search: string,
  ): Promise<UserEntity[]> {
    console.log(requestUser);

    return await this.repository.find({
      order: {
        name: 'ASC',
      },
      where: search ? { name: Like('%' + search + '%') } : {},
    });
  }

  public async getUserById(userId: number): Promise<UserEntity> {
    const user = await this.repository.findOneBy({ id: userId });

    if (!user) throw new NotFoundException('O usuário não foi encontrado');
    delete user.password;

    return user;
  }

  public async getUserByEmail(
    email: string,
    validateIsActive: boolean = true,
  ): Promise<UserEntity> {
    const user = await this.repository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (!user || (!user.isActive && validateIsActive))
      throw new NotFoundException(
        'O usuário com essa identificação não foi encontrado ou está desativado.',
      );

    return user;
  }

  public async createUser(payload: CreateUserPayload): Promise<UserProxy> {
    const haveUser = await this.repository.findOneBy({
      email: payload.email,
    });

    if (haveUser) throw new ForbiddenException('Oops...', 'Ocorreu um erro.');

    const user = new UserEntity();
    const passwordSalt = await bcryptjs.genSalt();

    user.name = payload.name;
    user.email = payload.email;
    user.city = payload.city;
    user.roles = !payload.roles ? [RolesEnum.USER] : [RolesEnum.ADMIN];
    user.password = await bcryptjs.hash(payload.password, passwordSalt);

    return await this.repository.save(user);
  }

  public async findByUsername(
    username: string,
    validateIsActive = true,
  ): Promise<UserEntity> {
    username = getCleanedString(username);

    const user = await this.repository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();

    if (!user || (!user.isActive && validateIsActive))
      throw new NotFoundException(
        'O usuário com essa identificação não foi encontrado ou está desativado.',
      );

    return user;
  }

  public async getMe(requestUser: UserEntity): Promise<UserEntity> {
    const user = await this.getUserById(requestUser.id);

    if (!user)
      throw new NotFoundException(
        'O usuário com essa identificação não foi encontrado ou está desativado.',
      );

    return user;
  }
}
