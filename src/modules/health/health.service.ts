import { PrismaService } from '@/infra/prisma/prisma.service';
import { MemoryMonitor } from '@/shared/utils/memory-monitor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

/**
 * Health check response interface
 * @interface HealthCheckResponse
 * @description Health check response interface
 * @example
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    database: {
      status: 'ok' | 'error';
      responseTime?: number;
      error?: string;
    };
    redis: {
      status: 'ok' | 'error';
      responseTime?: number;
      error?: string;
    };
    memory: {
      status: 'ok' | 'error';
      used: number;
      total: number;
      percentage: number;
    };
  };
}

/**
 * Health service
 * @class HealthService
 * @description Health service for checking the health of the application
 * @example
 */
@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly memoryMonitor: MemoryMonitor,
    @Optional() @Inject(CACHE_MANAGER) private cacheManager?: Cache,
  ) {}

  /**
   * Get health check
   * @returns Health check response
   */
  async getHealthCheck(): Promise<HealthCheckResponse> {
    try {
      this.memoryMonitor.logMemoryUsageWithContext('HEALTH_CHECK_START', {
        detailed: true,
      });

      const checks = {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        memory: this.checkMemory(),
      };

      const hasErrors = Object.values(checks).some(
        (check) => check.status === 'error',
      );
      const status: 'ok' | 'error' = hasErrors ? 'error' : 'ok';

      if (checks.memory.percentage > 80) {
        this.memoryMonitor.forceGarbageCollection();
      }

      this.memoryMonitor.logMemoryUsageWithContext('HEALTH_CHECK_END');

      return {
        status,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: this.configService.get<string>('NODE_ENV', 'development'),
        version: process.env.npm_package_version || '1.0.0',
        checks,
      };
    } catch (error) {
      console.error(error);
      this.memoryMonitor.logMemoryUsageWithContext('HEALTH_CHECK_ERROR', {
        detailed: true,
      });
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: 'unknown',
        version: '1.0.0',
        checks: {
          database: { status: 'error', error: 'Health check failed' },
          redis: { status: 'error', error: 'Health check failed' },
          memory: { status: 'error', used: 0, total: 0, percentage: 0 },
        },
      };
    }
  }

  /**
   * Get simple health check
   * @returns Simple health check response
   */
  async getSimpleHealthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      if (this.cacheManager) {
        await this.cacheManager.set('health-simple', 'ok', 5);
        const result = await this.cacheManager.get('health-simple');
        if (result !== 'ok') {
          throw new Error('Redis check failed');
        }
      }

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get readiness check
   * @returns Readiness check response
   */
  async getReadinessCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      if (this.cacheManager) {
        await this.cacheManager.set('ready-check', 'ok', 5);
      }

      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'not-ready',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get liveness check
   * @returns Liveness check response
   */
  getLivenessCheck(): { status: string; timestamp: string } {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check database connection
   * @returns Database check response
   */
  private async checkDatabase() {
    const startTime = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok' as const,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: 'error' as const,
        responseTime: Date.now() - startTime,
        error:
          error instanceof Error ? error.message : 'Unknown database error',
      };
    }
  }

  /**
   * Check Redis connection
   * @returns Redis check response
   */
  private async checkRedis() {
    const startTime = Date.now();
    try {
      if (!this.cacheManager) {
        throw new Error('Cache manager not available');
      }
      await this.cacheManager.set('health-check', 'ok', 10);
      const result = await this.cacheManager.get('health-check');
      if (result !== 'ok') {
        throw new Error('Redis read/write test failed');
      }
      return {
        status: 'ok' as const,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: 'error' as const,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown Redis error',
      };
    }
  }

  /**
   * Check memory usage
   * @returns Memory check response
   */
  private checkMemory() {
    const memStats = this.memoryMonitor.getMemoryStats();

    const status: 'ok' | 'error' = memStats.percentage > 85 ? 'error' : 'ok';

    return {
      status,
      used: memStats.heapUsed,
      total: memStats.heapTotal,
      percentage: memStats.percentage,
    };
  }
}
