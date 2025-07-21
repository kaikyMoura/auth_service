import { ResponseType } from "@/shared/types/response-type";
import { RegisterUserResponse } from "@/users/types/register-user-response";

/**
 * Auth response
 * @example
 * ```typescript
 * const authResponse: AuthResponse = { success: true, message: 'User registered successfully', data: user };
 * ```
 */
export type AuthResponse = ResponseType<RegisterUserResponse>