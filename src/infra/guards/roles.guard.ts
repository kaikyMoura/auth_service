import { Role } from '@/libs/users-client/domain/enums/role.enum';
import { CustomRequest } from '@/domain/interfaces/custom-request.interface';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Roles guard
 * @description This is the guard for the roles module
 * @returns Roles guard
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Check if the user has the required roles
   * @param context - The execution context
   * @returns True if the user has the required roles, false otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route does not have any roles, return true
    if (!requiredRoles) {
      return true;
    }

    // Get the request and user
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const user = request.user;

    // If the user is not authenticated, throw an error
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if the user has the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    // If the user does not have the required roles, throw an error
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    // If the user has the required roles, return true
    return true;
  }
}
