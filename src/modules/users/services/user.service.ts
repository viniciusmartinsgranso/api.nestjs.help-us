import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { Like, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserPayload } from "../models/create-user.payload";
import { UserProxy } from "../models/user.proxy";
import * as bcryptjs from "bcryptjs";
import { RolesEnum } from "../../../common/enums/roles.enum";
import { getCleanedString } from "../../../utils/utils/functions";
import { Roles } from "../../../decorators/roles/roles.decorator";
import { UpdateUserPayload } from "../models/update-user.payload";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {
  }

  public getRepository(): Repository<UserEntity> {
    return this.repository;
  }

  public async getUsers(
    requestUser: UserEntity,
    search: string
  ): Promise<UserEntity[]> {
    return await this.repository.find({
      order: {
        name: "ASC"
      },
      where: search ? { name: Like("%" + search + "%") } : {}
    });
  }

  public async getUserById(
    userId: number,
    occurrences?: boolean,
  ): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: occurrences ? ['occurrences'] : [],
    });

    if (!user) throw new NotFoundException("O usuário não foi encontrado");
    delete user.password;

    return user;
  }

  public async getUserByEmail(
    email: string,
    validateIsActive: boolean = true
  ): Promise<UserEntity> {
    const user = await this.repository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .getOne();

    if (!user || (!user.isActive && validateIsActive))
      throw new NotFoundException(
        "O usuário com essa identificação não foi encontrado ou está desativado."
      );

    return user;
  }

  public async createUser(payload: CreateUserPayload): Promise<UserProxy> {
    const haveUser = await this.repository.findOneBy({
      email: payload.email
    });

    if (haveUser) throw new ForbiddenException("Oops...", "Ocorreu um erro.");

    const user = new UserEntity();
    const passwordSalt = await bcryptjs.genSalt();

    user.name = payload.name;
    user.email = payload.email;
    user.city = payload.city;

    if (payload.roles && payload.roles.includes(RolesEnum.NONE)) {
      user.roles = [RolesEnum.NONE];
    } else {
      user.roles = !payload.roles ? [RolesEnum.USER] : [RolesEnum.ADMIN];
    }

    user.password = await bcryptjs.hash(payload.password, passwordSalt);

    return await this.repository.save(user);
  }

  public async findByUsername(
    username: string,
    validateIsActive = true
  ): Promise<UserEntity> {
    username = getCleanedString(username);

    const user = await this.repository
      .createQueryBuilder("user")
      .where("user.username = :username", { username })
      .getOne();

    if (!user || (!user.isActive && validateIsActive))
      throw new NotFoundException(
        "O usuário com essa identificação não foi encontrado ou está desativado."
      );

    return user;
  }

  public async getMe(
    requestUser: UserEntity,
    occurrences?: boolean,
  ): Promise<UserEntity> {
    const user = await this.getUserById(requestUser.id, occurrences);

    if (!user)
      throw new NotFoundException(
        "O usuário com essa identificação não foi encontrado ou está desativado."
      );

    return user;
  }

  public async delete(id: number): Promise<UserEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) throw new NotFoundException();

    return this.repository.remove(entity);
  }

  public async update(
    id: number,
    payload: UpdateUserPayload,
    request: UserEntity,
  ): Promise<UserEntity> {
    if (request.roles.includes(RolesEnum.NONE))
      throw new BadRequestException('Usuário não possui permissão.')

    const entity = await this.getUserById(id);

    if (!entity)
      throw new NotFoundException('Usuário não foi encontrado.');

    if (payload.name) entity.name = payload.name;
    if (payload.email) entity.email = payload.email;
    if (payload.city) entity.city = payload.city;
    if (payload.roles) entity.roles = payload.roles;

    return await this.repository.save(entity);
  }

}
