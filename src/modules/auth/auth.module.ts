import { Module } from '@nestjs/common';
import { AuthTokenModule } from './auth-token.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from "../users/user.module";

@Module({
  controllers: [AuthController],
  imports: [UserModule, AuthTokenModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
