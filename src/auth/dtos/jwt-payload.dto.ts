import { Role } from 'src/shared/enums/role.enum';

/**
 * Jwt payload
 * @class JwtPayload
 * @description Jwt payload for jwt management
 * @example
 * const jwtPayload = new JwtPayload(sub, email, role, iat, exp);
 */
export class JwtPayload {
  /**
   * The subject of the token (user id)
   */
  sub: string;
  /**
   * The email of the user
   */
  email: string;
  /**
   * The role of the user
   */
  role?: Role;
  /**
   * The issued at time of the token
   */
  iat?: number;
  /**
   * The expiration time of the token
   */
  exp?: number;
  /**
   * The session id of the user
   */
  sid?: string;
}
