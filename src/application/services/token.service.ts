import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as JwtServiceNest } from '@nestjs/jwt';
import { createHash, randomUUID } from 'crypto';
import { JwtPayload } from '../dtos/jwt-payload.dto';

/**
 * Token service
 * @class TokenService
 * @description Token service for token management
 * @example
 * const tokenService = new TokenService(jwt, configService);
 */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtServiceNest,
    private readonly configService: ConfigService,
  ) {
    if (!this.configService.get('JWT_SECRET_KEY')) {
      throw new Error('JWT_SECRET is not set');
    }
  }

  /**
   * Sign a token
   * @param payload - The payload to sign
   * @param expiresIn - The expiration time
   * @returns The signed token and expiration time
   */
  async signAccessToken(
    payload: JwtPayload,
    expiresIn?: string,
  ): Promise<{ token: string; expiresIn: string }> {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: expiresIn ?? this.configService.get('JWT_ACCESS_EXPIRES'),
    });

    return {
      token,
      expiresIn: expiresIn ?? this.configService.get('JWT_ACCESS_EXPIRES')!,
    };
  }

  /**
   * Sign a refresh token
   * @param payload - The payload to sign
   * @param expiresIn - The expiration time
   * @returns The signed token and expiration time
   */
  async signRefreshToken(
    expiresIn?: string,
  ): Promise<{ token: string; expiresIn: string }> {
    const hashedToken = createHash('sha256').update(randomUUID()).digest('hex');

    return Promise.resolve({
      token: hashedToken,
      expiresIn: expiresIn ?? this.configService.get('JWT_REFRESH_EXPIRES')!,
    });
  }

  /**
   * Verify a token
   * @param token - The token to verify
   * @returns The payload of the token
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token);
  }

  /**
   * Decode a token
   * @param token - The token to decode
   * @returns The payload of the token
   */
  async decodeToken(token: string): Promise<JwtPayload> {
    return this.jwtService.decode(token);
  }
}
