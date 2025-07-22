import { UserClientService } from '@/users-client/user-client.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dtos/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly cacheManager: Cache,
    private readonly userClientService: UserClientService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET_KEY');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET_KEY is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Validate the JWT payload
   * @param payload - The JWT payload
   * @returns The user
   * @throws {UnauthorizedException} - If the user is not found
   */
  async validate(payload: JwtPayload) {
    const cachedToken = await this.cacheManager.get<JwtPayload>(
      `user:${payload.sub}`,
    );

    if (cachedToken) {
      return cachedToken;
    }

    const user = await this.userClientService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const ttl = this.configService.get<number>('JWT_REFRESH_EXPIRES') ?? 3600;
    await this.cacheManager.set(`user:${payload.sub}`, user, ttl);
    return user;
  }
}
