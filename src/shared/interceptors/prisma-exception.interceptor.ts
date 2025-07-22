import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'prisma/app/generated/prisma/client/runtime/library';
import { catchError, Observable, throwError } from 'rxjs';
import { LoggerService } from '../loggers/logger.service';

/**
 * Interceptor to handle Prisma exceptions.
 */
@Injectable()
export class PrismaExceptionInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Intercepts the request and logs the Prisma exception.
   * @param context - The context of the request.
   * @param next - The next handler.
   * @returns The result of the request.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const contextName = context.getClass().name;

    this.logger.log(
      '🔄 PrismaExceptionInterceptor initialized',
      'PrismaExceptionInterceptor.intercept',
    );

    return next.handle().pipe(
      catchError((error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown Prisma error occurred';
        if (error instanceof PrismaClientKnownRequestError) {
          this.logger.error(
            `[${contextName}] Prisma error: ${errorMessage}`,
            'PrismaExceptionInterceptor.intercept',
          );
          return throwError(() => new BadRequestException(errorMessage));
        }
        this.logger.error(
          `[${contextName}] Unhandled error: ${errorMessage}`,
          (error as { stack: string }).stack,
        );
        return throwError(() => new InternalServerErrorException(error));
      }),
    );
  }
}
