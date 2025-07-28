import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { jwtConfig } from './jwt.config';

/**
 * Create JWT module options
 * @description This is the configuration for the JWT module
 * @returns JWT module options
 */
export const jwtModuleOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [jwtConfig.KEY],
  useFactory: (config: ConfigType<typeof jwtConfig>) => ({
    secret: config.secret,
    signOptions: {
      expiresIn: config.accessExpiresIn,
    },
  }),
};
