import { registerAs } from '@nestjs/config';
import { ThrottlerOptions } from '@nestjs/throttler';

/**
 * Throttler configuration
 * @description This is the configuration for the throttler module
 * @returns Throttler configuration
 */
export default registerAs('throttler', (): ThrottlerOptions => {
  return {
    ttl: Number(process.env.THROTTLER_TTL) || 60,
    limit: Number(process.env.THROTTLER_LIMIT) || 10,
  };
});
