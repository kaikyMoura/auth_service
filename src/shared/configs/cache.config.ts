import { registerAs } from '@nestjs/config';

/**
 * Cache configuration interface
 * @description This is the interface for the cache configuration
 */
export interface CacheConfig {
  url: string;
  defaultTtl: number;
  maxItems: number;
}

/**
 * Cache configuration
 * @description This is the configuration for the cache module
 * @returns Cache configuration
 */
export const cacheConfig = registerAs('cache', (): CacheConfig => {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL environment variable is required');
  }

  return {
    url: process.env.REDIS_URL,
    defaultTtl: Number(process.env.REDIS_TTL) || 300,
    maxItems: Number(process.env.REDIS_MAX_ITEMS) || 100,
  };
});
