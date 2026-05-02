import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthUrlProxy {
  constructor(authorizationUrl: string) {
    this.authorizationUrl = authorizationUrl;
  }

  @ApiProperty({
    description: 'URL para redirecionar o usuário ao consentimento do Google',
  })
  public authorizationUrl: string;
}
