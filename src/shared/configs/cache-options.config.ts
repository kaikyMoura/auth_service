import KeyvRedis from '@keyv/redis';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheConfig } from './cache.config';

/**
 * Cache module options
 * @description This is the configuration for the cache module
 * @returns Cache module options
 */
export const cacheModuleOptions: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  isGlobal: process.env.NODE_ENV !== 'test' ? true : false,
  useFactory: async (configService: ConfigService) => {
    const cacheConfig = configService.get<CacheConfig>('cache');

    return Promise.resolve(
      cacheConfig?.url
        ? {
            store: new KeyvRedis(cacheConfig.url, {
              connectionTimeout: 1000,
            }),
            ttl: cacheConfig.defaultTtl,
            max: cacheConfig.maxItems,
          }
        : { ttl: cacheConfig?.defaultTtl ?? 300, store: undefined },
    );
  },
  inject: [ConfigService],
};
