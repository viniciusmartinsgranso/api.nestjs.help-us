import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';

export function ProtectTo(...roles: string[]): MethodDecorator {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard('jwt')),
    ApiBearerAuth(),
    ApiForbiddenResponse({
      description: 'Você não tem permissão para acessar esse recurso.',
    }),
  );

  // return (...params) => {
  //   UseGuards(AuthGuard('jwt'))(...params);
  //   ApiBearerAuth()(...params);
  // };
}
