import { BadRequestException, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { environment } from 'src/environment/environment';

@Injectable()
export class GoogleOAuthService {
  private loginScopes: string[] = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  private assertConfigured(): void {
    const env = environment as NodeJS.ProcessEnv;
    const secret =
      env.GOOGLE_CLIENT_SECRET || env.GOOGLE_CLIENT_SECRET_KEY;

    if (!env.GOOGLE_CLIENT_ID || !secret || !env.GOOGLE_REDIRECT_URI) {
      throw new BadRequestException(
        'Google OAuth não configurado. Defina GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (ou GOOGLE_CLIENT_SECRET_KEY) e GOOGLE_REDIRECT_URI no ambiente (deve ser a URL de callback do front, ex.: http://localhost:4200/oauth-google-callback).',
      );
    }
  }

  private createClient() {
    this.assertConfigured();
    const env = environment as NodeJS.ProcessEnv;
    const secret =
      env.GOOGLE_CLIENT_SECRET || env.GOOGLE_CLIENT_SECRET_KEY;

    return new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      secret,
      env.GOOGLE_REDIRECT_URI,
    );
  }

  /** Primeiro passo do fluxo: URL para o front redirecionar o usuário ao Google. */
  public getAuthorizationUrl(state?: string): string {
    const oauth2Client = this.createClient();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.loginScopes,
      prompt: 'consent',
      ...(state !== undefined ? { state } : {}),
    });
  }

  /** Troca o `code` do callback pelo access_token (próximo passo do login). */
  public async exchangeCodeForTokens(code: string) {
    const oauth2Client = this.createClient();
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }

  /** Perfil básico do usuário autenticado no Google (email, nome, foto). */
  public async getUserInfo(accessToken: string) {
    const oauth2Client = this.createClient();
    oauth2Client.setCredentials({ access_token: accessToken });
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    return data;
  }
}
