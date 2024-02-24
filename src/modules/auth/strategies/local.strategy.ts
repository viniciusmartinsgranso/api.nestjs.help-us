import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../../users/entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(
    private readonly service: AuthService,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<UserEntity> {
    return this.service.authenticate(username, password);
  }

}