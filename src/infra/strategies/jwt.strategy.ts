import { IUserClientService } from '@/libs/users-client/domain/interfaces/user-client-service.interface';
import { USER_CLIENT_SERVICE } from '@/libs/users-client/domain/interfaces/user-client.tokens';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../application/dtos/jwt-payload.dto';

/**
 * The JwtStrategy class
 * @description This strategy is used to validate the JWT payload
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_CLIENT_SERVICE)
    private readonly userClientService: IUserClientService,
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
    const cachedToken = await this.userClientService.getUserCacheById(
      payload.sub,
    );

    if (cachedToken) {
      return cachedToken;
    }

    const user = await this.userClientService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const ttl = this.configService.get<number>('JWT_REFRESH_EXPIRES') ?? 3600;
    await this.userClientService.setUserCache(
      payload.sub,
      user,
      undefined,
      ttl,
    );
    return user;
  }
}
