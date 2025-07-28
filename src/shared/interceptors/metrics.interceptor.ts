import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, Observable, tap } from 'rxjs';
import { CustomRequest } from '../../domain/interfaces/custom-request.interface';
import { CustomResponse } from '../../domain/interfaces/custom-response.interface';
import { LoggerService } from '../../infra/logger/logger.service';

/**
 * Interface to store request metrics.
 */
interface RequestMetrics {
  method: string;
  route: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  userAgent: string;
  userId: string;
}

/**
 * Interceptor to log metrics.
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private metrics: RequestMetrics[] = [];
  private readonly maxMetrics: number;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.maxMetrics = this.configService.get<number>(
      'METRICS_MAX_METRICS',
      1000,
    );
  }

  /**
   * Intercepts the request and response to collect metrics.
   * @param context - The execution context.
   * @param next - The call handler.
   * @returns An observable of the response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const response = context.switchToHttp().getResponse<CustomResponse>();

    const method = request.method ?? 'unknown';
    const route = request.route?.path ?? request.originalUrl ?? 'unknown';
    const userAgent = request.headers['user-agent'] ?? 'unknown';
    const userId = request.user?.sub ?? 'anonymous';

    this.logger.log(
      `📊 [${context.getClass().name}] ${method} ${route} - MetricsInterceptor triggered`,
      'MetricsInterceptor',
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        const statusCode = response.statusCode || 500;

        const metric: RequestMetrics = {
          method,
          route,
          statusCode,
          responseTime: duration,
          timestamp: new Date(),
          userAgent,
          userId,
        };

        this.addMetric(metric);

        if (duration > 1000) {
          this.logger.warn(
            `🐢 Slow request: ${method} ${route} took ${duration}ms`,
            'MetricsInterceptor',
          );
        }
      }),
      catchError((err) => {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        this.logger.error(
          `❌ Error while processing ${method} ${route}: ${errorMessage}`,
          'MetricsInterceptor',
        );
        throw err;
      }),
    );
  }

  /**
   * Adds a metric to the metrics array and ensures the array size does not exceed the maximum limit.
   * Removes the oldest metrics if the size exceeds the limit to prevent memory leaks.
   * @param metric - The request metric to be added.
   */
  private addMetric(metric: RequestMetrics): void {
    this.logger.log(
      `Adding metric: ${metric.method} ${metric.route} ${metric.statusCode} ${metric.responseTime} ${metric.timestamp.toISOString()} ${metric.userAgent} ${metric.userId}`,
      'MetricsInterceptor.addMetric',
    );
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Retrieves a copy of all recorded request metrics.
   * @returns An array of RequestMetrics objects, each representing a recorded request metric.
   */
  getMetrics(): RequestMetrics[] {
    this.logger.log(
      `Getting metrics: ${this.metrics.length} metrics`,
      'MetricsInterceptor.getMetrics',
    );
    return [...this.metrics];
  }

  /**
   * Calculates the average response time for the last N minutes.
   * The average is based on the metrics collected since the application started.
   * If no metrics are available, the method returns 0.
   * @param minutes - The number of minutes to consider for the average response time. Defaults to 5.
   * @returns The average response time in milliseconds.
   */
  getAverageResponseTime(minutes: number = 5): number {
    this.logger.log(
      `Getting average response time for last ${minutes} minutes`,
      'MetricsInterceptor.getAverageResponseTime',
    );
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    const recentMetrics = this.metrics.filter((m) => m.timestamp > cutoff);

    if (recentMetrics.length === 0) return 0;

    const total = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0);
    return total / recentMetrics.length;
  }

  /**
   * Retrieves the count of requests made in the last N minutes.
   * The count is based on the metrics collected since the application started.
   * If no metrics are available, the method returns 0.
   * @param minutes - The number of minutes to consider for counting requests. Defaults to 5.
   * @returns The number of requests made in the specified time frame.
   */
  getRequestCount(minutes: number = 5): number {
    this.logger.log(
      `Getting request count for last ${minutes} minutes`,
      'MetricsInterceptor.getRequestCount',
    );
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.metrics.filter((m) => m.timestamp > cutoff).length;
  }

  /**
   * Calculates the error rate of requests for the last N minutes.
   * The error rate is determined by the percentage of requests with status codes 400 and above.
   * If no metrics are available, the method returns 0.
   * @param minutes - The number of minutes to consider for calculating the error rate. Defaults to 5.
   * @returns The error rate as a percentage.
   */
  getErrorRate(minutes: number = 5): number {
    this.logger.log(
      `Getting error rate for last ${minutes} minutes`,
      'MetricsInterceptor.getErrorRate',
    );
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    const recentMetrics = this.metrics.filter((m) => m.timestamp > cutoff);

    if (recentMetrics.length === 0) {
      this.logger.log(
        `No metrics available for error rate calculation`,
        'MetricsInterceptor.getErrorRate',
      );
      return 0;
    }

    const errorCount = recentMetrics.filter((m) => m.statusCode >= 400).length;
    const errorRate = (errorCount / recentMetrics.length) * 100;
    this.logger.log(
      `Error rate: ${errorRate}%`,
      'MetricsInterceptor.getErrorRate',
    );
    return errorRate;
  }
}
