import { Injectable, BadRequestException } from '@nestjs/common';
import { LoggerService } from '@/infra/logger/logger.service';

/**
 * Rate limit service
 * @description This service is responsible for rate limiting login attempts]
 */
@Injectable()
export class RateLimitService {
  /**
   * The maximum number of login attempts
   */
  private readonly maxLoginAttempts = 5;
  /**
   * The lockout duration in milliseconds
   */
  private readonly lockoutDuration = 15 * 60 * 1000; // 15 minutes
  /**
   * The login attempts map
   */
  private readonly loginAttempts = new Map<
    string,
    { count: number; lastAttempt: Date }
  >();

  constructor(private readonly logger: LoggerService) {}

  /**
   * Check the rate limit for a given key
   * @param key - The key to check the rate limit for
   */
  checkRateLimit(key: string): void {
    const context = `${this.constructor.name}.${this.checkRateLimit.name}`;
    this.logger.log(`Checking rate limit for ${key}`, context);

    const attempts = this.loginAttempts.get(key);
    this.logger.log(`Attempts: ${JSON.stringify(attempts, null, 2)}`, context);

    if (attempts && attempts.count >= this.maxLoginAttempts) {
      this.logger.log(
        `Too many login attempts. Locking out for ${this.lockoutDuration}ms`,
        context,
      );

      const timeSinceLockout = Date.now() - attempts.lastAttempt.getTime();
      this.logger.log(`Time since lockout: ${timeSinceLockout}ms`, context);

      if (timeSinceLockout < this.lockoutDuration) {
        const remainingTime = Math.ceil(
          (this.lockoutDuration - timeSinceLockout) / 1000,
        );
        this.logger.log(`Remaining time: ${remainingTime}s`, context);
        throw new BadRequestException(
          `Too many login attempts. Please try again in ${remainingTime} seconds.`,
        );
      } else {
        this.loginAttempts.delete(key);
        this.logger.log(`Lockout removed for ${key}`, context);
      }
    }
  }

  /**
   * Record a failed attempt for a given key
   * @param key - The key to record the failed attempt for
   */
  recordFailedAttempt(key: string): void {
    const context = `${this.constructor.name}.${this.recordFailedAttempt.name}`;
    this.logger.log(`Recording failed attempt for ${key}`, context);

    const attempts = this.loginAttempts.get(key) || {
      count: 0,
      lastAttempt: new Date(),
    };

    attempts.count += 1;
    attempts.lastAttempt = new Date();

    this.loginAttempts.set(key, attempts);
    this.logger.log(`Failed attempts for ${key}: ${attempts.count}`, context);
  }

  /**
   * Clear the rate limit for a given key
   * @param key - The key to clear the rate limit for
   */
  clearRateLimit(key: string): void {
    const context = `${this.constructor.name}.${this.clearRateLimit.name}`;
    this.loginAttempts.delete(key);
    this.logger.log(`Rate limit cleared for ${key}`, context);
  }
}
