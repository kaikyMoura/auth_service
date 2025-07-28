import { registerAs } from '@nestjs/config';
import joi from 'joi';

/**
 * JWT configuration
 * @description This is the configuration for the JWT module
 * @returns JWT configuration
 */
export interface JwtConfig {
  JWT_SECRET_KEY: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_EXPIRES: string;
}

/**
 * JWT configuration
 * @description This is the configuration for the JWT module
 * @returns JWT configuration
 */
export const jwtConfig = registerAs('jwt', (): JwtConfig => {
  const envVars = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
  };

  const schema = joi.object<JwtConfig>({
    JWT_SECRET_KEY: joi.string().required(),
    JWT_ACCESS_EXPIRES: joi.string().required(),
    JWT_REFRESH_EXPIRES: joi.string().required(),
  });

  const { error, value } = schema.validate(envVars, {
    abortEarly: false,
    allowUnknown: true,
  }) as {
    error: joi.ValidationError;
    value: JwtConfig;
  };

  if (error) {
    throw new Error(`JWT configuration error: ${error.message}`);
  }

  return value;
});
