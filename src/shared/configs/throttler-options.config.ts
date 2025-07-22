import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ThrottlerAsyncOptions,
  ThrottlerModuleOptions,
  ThrottlerOptions,
} from '@nestjs/throttler';

/**
 * Throttler module options
 * @description This is the configuration for the throttler module
 * @returns Throttler module options
 */
export const throttlerModuleOptions: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): ThrottlerModuleOptions => {
    const throttlerConfig = configService.get<ThrottlerOptions>('throttler');
    return {
      throttlers: [
        {
          ttl: throttlerConfig?.ttl ?? 60,
          limit: throttlerConfig?.limit ?? 10,
        },
      ],
    };
  },
  inject: [ConfigService],
};
