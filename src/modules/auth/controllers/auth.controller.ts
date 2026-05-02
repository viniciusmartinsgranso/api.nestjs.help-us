import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/decorators/user/user.decorator';
import { LoginPayload } from '../models/login.payload';
import { TokenProxy } from '../models/token.proxy';
import { GoogleAuthUrlProxy } from '../models/google-auth-url.proxy';
import { GoogleCallbackPayload } from '../models/google-callback.payload';
import { AuthService } from '../services/auth.service';
import { UserEntity } from '../../users/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Realiza o login de um usuário' })
  @ApiOkResponse({ type: TokenProxy })
  @ApiBody({ type: LoginPayload })
  public async login(@User() requestUser: UserEntity): Promise<TokenProxy> {
    return await this.service.generateToken(requestUser);
  }

  @Post('invited')
  public async invited(): Promise<TokenProxy> {
    return await this.service.generateInvitedToken();
  }

  @Get('google')
  @ApiOperation({
    summary:
      'Retorna a URL de autorização Google (front redireciona o usuário para lá)',
  })
  @ApiOkResponse({ type: GoogleAuthUrlProxy })
  public async google(): Promise<GoogleAuthUrlProxy> {
    return await this.service.googleLogin();
  }

  @Post('google/callback')
  @ApiOperation({
    summary:
      'Recebe o code do Google e devolve o JWT do app (passo após o redirect OAuth)',
  })
  @ApiOkResponse({ type: TokenProxy })
  @ApiBody({ type: GoogleCallbackPayload })
  public async googleCallback(
    @Body() body: GoogleCallbackPayload,
  ): Promise<TokenProxy> {
    return await this.service.completeGoogleLogin(body.code);
  }
}
