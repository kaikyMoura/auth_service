import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfig } from './jwt.config';

/**
 * JWT options
 * @description This is the configuration for the JWT module
 * @returns JWT options
 */
export const jwtModuleOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  global: true,
  useFactory: (configService: ConfigService) => {
    const jwtConfig = configService.get<JwtConfig>('jwt');
    return {
      secret: jwtConfig?.secret,
      signOptions: { expiresIn: jwtConfig?.accessExpiresIn },
    };
  },
  inject: [ConfigService],
};
