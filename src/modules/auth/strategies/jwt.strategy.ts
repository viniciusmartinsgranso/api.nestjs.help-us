import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { environment } from 'src/environment/environment';
import { JwtPayload } from '../models/jwt.payload';
import { AuthService } from '../services/auth.service';
import { UserEntity } from '../../users/entities/user.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly service: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environment.JWT_KEY,
      ignoreExpiration: true,
    });
  }

  public async validate(payload: JwtPayload): Promise<UserEntity> {
    return await this.service.validateJwt(payload);
  }
}
