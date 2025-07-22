import { registerAs } from '@nestjs/config';

export interface CacheConfig {
  url: string;
  defaultTtl: number;
  maxItems: number;
}

export default registerAs('cache', (): CacheConfig => {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL environment variable is required');
  }

  return {
    url: process.env.REDIS_URL,
    defaultTtl: Number(process.env.REDIS_TTL) || 300,
    maxItems: Number(process.env.REDIS_MAX_ITEMS) || 100,
  };
});
