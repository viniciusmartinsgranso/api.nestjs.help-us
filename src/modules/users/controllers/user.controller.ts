import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserProxy } from '../models/user.proxy';
import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { CreateUserPayload } from '../models/create-user.payload';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { User } from '../../../decorators/user/user.decorator';
import { UserEntity } from '../entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ProtectTo()
  @Get()
  @ApiOperation({ summary: 'Obtém os dados de todos os usuários' })
  @ApiOkResponse({ type: UserProxy, isArray: true })
  @ApiQuery({
    name: 'search',
    description: 'A busca a ser realizada',
    required: false,
  })
  public async getUsers(
    @User() requestUser: UserEntity,
    @Query('search') search: string,
  ): Promise<UserProxy[]> {
    return this.userService
      .getUsers(requestUser, search)
      .then((result) => result.map((entity) => new UserProxy(entity)));
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiOkResponse({ type: UserProxy })
  @ApiBody({
    type: CreateUserPayload,
    description: 'Os dados a serem cadastrados no usuário',
  })
  public async createUser(@Body() user: CreateUserPayload): Promise<UserProxy> {
    return this.userService.createUser(user);
  }

  @ProtectTo()
  @Get('me')
  @ApiOperation({ summary: 'Retorna as informações do usuário logado' })
  @ApiOkResponse({ type: UserProxy })
  public async getMe(@User() requestUser: UserEntity): Promise<UserProxy> {
    return this.userService.getMe(requestUser);
  }

  @ProtectTo()
  @Get('one/:id')
  @ApiOperation({ summary: 'Obtém os dados de um usuário' })
  @ApiOkResponse({ type: UserProxy })
  public async getUserById(@Param('id') id: number): Promise<UserProxy> {
    return this.userService.getUserById(id);
  }

}
