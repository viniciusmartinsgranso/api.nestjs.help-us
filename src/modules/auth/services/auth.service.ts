import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../models/jwt.payload';
import { TokenProxy } from '../models/token.proxy';
import { UserService } from "../../users/services/user.service";
import { UserEntity } from "../../users/entities/user.entity";
import { GoogleOAuthService } from './google-oauth.service';
import { GoogleAuthUrlProxy } from '../models/google-auth-url.proxy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly googleOAuth: GoogleOAuthService,
  ) {}

  public async authenticate(
    email: string,
    passwordInPlainText: string,
  ): Promise<UserEntity> {
    const user = await this.userService.getRepository().findOneBy({ email });

    if (!user) throw new BadRequestException('Email ou senha inválidos');

    const isPasswordValid = await bcryptjs.compare(
      passwordInPlainText,
      user.password,
    );

    if (!isPasswordValid)
      throw new BadRequestException('Email ou senha inválidos');

    return user;
  }

  public async generateToken(user: UserEntity): Promise<TokenProxy> {
    const payload: JwtPayload = {
      id: user.id,
    };

    const token = await this.jwtService.signAsync(payload, { expiresIn: '1d' });

    return new TokenProxy(token);
  }

  public async validateJwt(payload: JwtPayload): Promise<UserEntity> {
    return await this.userService.getUserById(payload.id);
  }

  public async generateInvitedToken(): Promise<TokenProxy> {
    const payload: JwtPayload = {
      id: 5,
    };

    const token = await this.jwtService.signAsync(payload, { expiresIn: '1d' });

    return new TokenProxy(token);
  }

  public async googleLogin(state?: string): Promise<GoogleAuthUrlProxy> {
    const authorizationUrl = this.googleOAuth.getAuthorizationUrl(state);
    return new GoogleAuthUrlProxy(authorizationUrl);
  }

  public async completeGoogleLogin(code: string): Promise<TokenProxy> {
    console.log('Passou pelo google para logar novamente')
    console.log('Código do google', code)
    const tokens = await this.googleOAuth.exchangeCodeForTokens(code);
    const accessToken = tokens.access_token;

    if (!accessToken) {
      throw new BadRequestException(
        'O Google não retornou access_token; verifique o redirect e o code.',
      );
    }

    const profile = await this.googleOAuth.getUserInfo(accessToken);
    const email = profile.email;

    if (!email) {
      throw new BadRequestException(
        'O Google não retornou o e-mail (confira os escopos OAuth).',
      );
    }

    const user = await this.userService.findOrCreateFromGoogleProfile({
      email,
      name: profile.name ?? '',
      picture: profile.picture ?? undefined,
    });

    return await this.generateToken(user);
  }
}
