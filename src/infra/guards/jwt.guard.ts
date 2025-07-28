import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * The JwtGuard class
 * @description This guard is used to protect routes that require authentication
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * Check if the request is public or not
   * @param context - The execution context
   * @returns True if the request is public, false otherwise
   */
  canActivate(
    context: ExecutionContext,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, return true
    if (isPublic) {
      return true;
    }

    // If the route is not public, check if the user is authenticated
    return super.canActivate(context);
  }
}
