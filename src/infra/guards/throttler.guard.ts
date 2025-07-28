import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CustomRequest } from '../../domain/interfaces/custom-request.interface';
import { LoggerService } from '../logger/logger.service';

/**
 * The CustomThrottlerGuard class
 * @description This guard is used to protect routes that require throttling
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger: LoggerService = new LoggerService();

  /**
   * Checks if the request is throttled
   * @param context - The execution context
   * @returns True if the request is throttled, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the request and user
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const { ip, method, route, url } = request;

    // Check if the request is throttled
    const isAllowed = await super.canActivate(context);

    // If the request is throttled, log the error
    if (!isAllowed) {
      this.logger.log(
        'Request is throttled',
        'CustomThrottlerGuard.canActivate',
      );

      this.logger.warn(
        `Rate limit exceeded for the ip ${ip} on method ${method as string} ${url as string} and path ${route?.path}`,
        'CustomThrottlerGuard.canActivate',
      );
    }

    // If the request is not throttled, return true
    return isAllowed;
  }
}
