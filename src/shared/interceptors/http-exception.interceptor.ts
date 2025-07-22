import { LoggerService } from '@/shared/loggers/logger.service';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class HttpExceptionInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Intercepts the request and handles the error
   * @param context - The execution context
   * @param next - The call handler
   * @returns The observable
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const contextName = context.getClass().name;

    this.logger.log('Intercepting request...', contextName);

    return next.handle().pipe(
      catchError((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        if (error instanceof HttpException) {
          this.logger.warn(`[${contextName}] HttpException: ${errorMessage}`);
          return throwError(
            () => new HttpException(errorMessage, error.getStatus()),
          );
        }

        if (error instanceof AxiosError) {
          const status = error.response?.status ?? 500;
          const responseData =
            (error.response?.data as object) ?? 'Unknown Axios error';
          this.logger.error(
            `[${contextName}] AxiosError: ${errorMessage}`,
            error.stack,
          );
          return throwError(() => new HttpException(responseData, status));
        }

        this.logger.error(
          `[${contextName}] Unhandled error: ${errorMessage}`,
          (error as { stack: string }).stack,
        );
        return throwError(() => new HttpException(errorMessage, 500));
      }),
    );
  }
}
