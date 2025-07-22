import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CustomRequest } from '../interfaces/custom-request';
import { LoggerService } from '../loggers/logger.service';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger: LoggerService = new LoggerService();

  /**
   * Checks if the request is throttled
   * @param context - The execution context
   * @returns True if the request is throttled, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const { ip, method, route, url } = request;

    const isAllowed = await super.canActivate(context);
    if (!isAllowed) {
      this.logger.log(
        'Request is throttled',
        'CustomThrottlerGuard.canActivate',
      );

      this.logger.warn(
        `Rate limit exceeded for the ip ${ip} on method ${method} ${url} and path ${route?.path}`,
        'CustomThrottlerGuard.canActivate',
      );
    }

    return isAllowed;
  }
}
