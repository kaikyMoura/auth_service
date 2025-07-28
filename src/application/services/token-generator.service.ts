import { AuthTokens } from '@/application/dtos/auth-tokens.dto';
import { User } from '@/libs/users-client/domain/types/user';
import { Injectable } from '@nestjs/common';
import { TokenService } from './token.service';

/**
 * Token Generator Service
 * @description This service is responsible for generating authentication tokens
 * following the Single Responsibility Principle
 */
@Injectable()
export class TokenGeneratorService {
  constructor(private readonly tokenService: TokenService) {}

  /**
   * Generate authentication tokens for a user
   * @param user - The user to generate tokens for
   * @param sessionId - The session ID
   * @returns The generated authentication tokens
   */
  async generateTokens(user: User, sessionId: string): Promise<AuthTokens> {
    const payload = {
      id: user.id,
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: sessionId,
    };

    const accessTokenExpiresIn = '15m';
    const refreshTokenExpiresIn = '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload, accessTokenExpiresIn),
      this.tokenService.signRefreshToken(refreshTokenExpiresIn),
    ]);

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    };
  }

  /**
   * Generate tokens with custom expiration times
   * @param user - The user to generate tokens for
   * @param sessionId - The session ID
   * @param accessTokenExpiresIn - Custom access token expiration
   * @param refreshTokenExpiresIn - Custom refresh token expiration
   * @returns The generated authentication tokens
   */
  async generateTokensWithCustomExpiration(
    user: User,
    sessionId: string,
    accessTokenExpiresIn: string = '15m',
    refreshTokenExpiresIn: string = '7d',
  ): Promise<AuthTokens> {
    const payload = {
      id: user.id,
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: sessionId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload, accessTokenExpiresIn),
      this.tokenService.signRefreshToken(refreshTokenExpiresIn),
    ]);

    // Calculate expiration in seconds
    const expiresIn = this.calculateExpirationInSeconds(refreshTokenExpiresIn);

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresIn,
    };
  }

  /**
   * Calculate expiration time in seconds from a time string
   * @param timeString - Time string (e.g., '7d', '15m', '1h')
   * @returns Expiration time in seconds
   */
  private calculateExpirationInSeconds(timeString: string): number {
    const unit = timeString.slice(-1);
    const value = parseInt(timeString.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 7 * 24 * 60 * 60; // Default to 7 days
    }
  }
}
