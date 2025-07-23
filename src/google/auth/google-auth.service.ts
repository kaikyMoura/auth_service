import { LoggerService } from '@/shared/loggers/logger.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private readonly client: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.client = new OAuth2Client({
      credentials: configService.get('GOOGLE_CREDENTIALS'),
    });
  }

  /**
   * Verify a Google ID token
   * @param token - The ID token to verify
   * @returns The payload of the ID token
   */
  async verifyToken(token: string) {
    this.logger.log('Verifying token', 'GoogleAuthService.verifyToken');
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    if (!payload) {
      this.logger.error('Invalid token', 'GoogleAuthService.verifyToken');
      throw new UnauthorizedException('Invalid token');
    }

    this.logger.log('Token verified', 'GoogleAuthService.verifyToken');
    return payload;
  }
}
