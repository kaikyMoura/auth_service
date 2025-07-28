import { ResponseType } from '@/shared/types/response-type';
import { AuthTokens } from './auth-tokens.dto';

/**
 * Auth response
 * @example
 * ```typescript
 * const authResponse: AuthResponse = { success: true, message: 'User registered successfully', data: user };
 * ```
 */
export type AuthResponse = ResponseType<AuthTokens>;
