import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomRequest } from '../../domain/interfaces/custom-request.interface';
import { LoggerService } from '../../infra/logger/logger.service';
import { MemoryMonitor } from '../utils/memory-monitor';

/**
 * Interceptor to log memory usage.
 */
@Injectable()
export class MemoryMonitorInterceptor implements NestInterceptor {
  constructor(
    private readonly memoryMonitor: MemoryMonitor,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Intercepts the request and logs the memory usage.
   * @param context - The context of the request.
   * @param next - The next handler.
   * @returns The result of the request.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const { method, url } = request;

    this.logger.log(
      `🔄 MemoryMonitorInterceptor initialized for ${method} ${url}`,
      'MemoryMonitorInterceptor.intercept',
    );

    this.memoryMonitor.logMemoryUsageWithContext(
      `🔄 MemoryMonitorInterceptor before ${method} ${url}`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;

        this.memoryMonitor.logMemoryUsageWithContext(
          `🔄 MemoryMonitorInterceptor after ${method} ${url} (${duration}ms)`,
        );

        if (duration > 5000) {
          this.memoryMonitor.forceGarbageCollection();
        }

        if (url?.includes('health')) {
          this.memoryMonitor.logDetailedMemoryInfo();
        }
      }),
    );
  }
}
