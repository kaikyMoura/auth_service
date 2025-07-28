import { registerAs } from '@nestjs/config';

/**
 * JWT configuration
 * @description This is the configuration for the JWT module
 * @returns JWT configuration
 */
export interface JwtConfig {
  secret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

/**
 * JWT configuration
 * @description This is the configuration for the JWT module
 * @returns JWT configuration
 */
export const jwtConfig = registerAs('jwt', (): JwtConfig => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY environment variable is required');
  }

  return {
    secret: process.env.JWT_SECRET_KEY,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  };
});
