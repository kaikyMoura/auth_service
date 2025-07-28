import { registerAs } from '@nestjs/config';

/**
 * Database configuration interface
 * @description This is the interface for the database configuration
 * @returns Database configuration interface
 */
export interface DatabaseConfig {
  url: string;
  directUrl?: string;
  maxConnections: number;
  minConnections: number;
  connectionTimeout: number;
  logLevel: string;
  ssl: boolean;
}

/**
 * Database configuration
 * @description This is the configuration for the database module
 * @returns Database configuration
 */
export const databaseConfig = registerAs('database', (): DatabaseConfig => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  return {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL || undefined,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS!, 10) || 10,
    minConnections: parseInt(process.env.DB_MIN_CONNECTIONS!, 10) || 1,
    connectionTimeout:
      parseInt(process.env.DB_CONNECTION_TIMEOUT!, 10) || 30000,
    logLevel: process.env.DB_LOG_LEVEL || 'warn',
    ssl: process.env.DB_SSL === 'true',
  };
});
