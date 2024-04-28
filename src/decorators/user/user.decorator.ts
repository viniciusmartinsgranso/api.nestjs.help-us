// #region Imports

import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../../modules/users/entities/user.entity';

// #endregion

/**
 * O decorador que extrai as informações do usuário da requisição
 */
export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
