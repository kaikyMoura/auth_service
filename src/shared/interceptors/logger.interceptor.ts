import {
  CallHandler,
  ExecutionContext,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { CustomRequest } from '../interfaces/custom-request';
import { CustomResponse } from '../interfaces/custom-response';

/**
 * Interceptor to log requests and responses.
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Intercepts the request and logs the request and response.
   * @param context - The context of the request.
   * @param next - The next handler.
   * @returns The result of the request.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const response = context.switchToHttp().getResponse<CustomResponse>();

    const { method, url, body, query, params } = request;

    const { statusCode } = response;
    this.logger.log(`${method} ${url} ${statusCode}`, 'LoggerInterceptor');

    if (process.env.NODE_ENV === 'development') {
      if (body) this.logger.debug?.(`Request Body: ${JSON.stringify(body)}`);
      if (query) this.logger.debug?.(`Request Query: ${JSON.stringify(query)}`);
      if (params)
        this.logger.debug?.(`Request Params: ${JSON.stringify(params)}`);
    }

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(
          `Outgoing Response: ${method} ${url} - ${responseTime}ms`,
        );
      }),
    );
  }
}
