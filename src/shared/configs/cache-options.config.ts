import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigType } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { cacheConfig } from './cache.config';

/**
 * Create cache module options
 * @description This is the function to create the cache module options
 * @returns Cache module options
 */
export const cacheModuleOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [cacheConfig.KEY],
  useFactory: (config: ConfigType<typeof cacheConfig>) => {
    const useRedis = Boolean(config.url);
    const store = useRedis
      ? new KeyvRedis(config.url, { connectionTimeout: 1000 })
      : undefined;

    return {
      store,
      ttl: config.defaultTtl,
      max: config.maxItems,
    };
  },
};
