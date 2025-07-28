import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, asapScheduler, from, scheduled } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { LoggerService } from '../../infra/logger/logger.service';

/**
 * Interceptor to cache responses.
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly ttl: number;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.ttl = this.configService.get<number>('THROTTLER_TTL', 60);
  }

  /**
   * Intercepts the request and caches the response.
   * @param context - The context of the request.
   * @param next - The next handler.
   * @returns The result of the request.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const key = context.getHandler().name;

    this.logger.log(
      `🔄 CacheInterceptor initialized for ${key}`,
      'CacheInterceptor.intercept',
    );

    return from(this.cacheManager.get(key)).pipe(
      switchMap((cached) => {
        if (cached !== undefined && cached !== null) {
          this.logger.log(
            `🔄 CacheInterceptor found for ${key}`,
            'CacheInterceptor.intercept',
          );
          return scheduled([cached], asapScheduler);
        }
        return next.handle().pipe(
          tap((response) => {
            if (response !== undefined && response !== null) {
              void this.cacheManager.set(key, response, this.ttl);
              this.logger.log(
                `🔄 CacheInterceptor set for ${key}`,
                'CacheInterceptor.intercept',
              );
            }
          }),
        );
      }),
    );
  }
}
