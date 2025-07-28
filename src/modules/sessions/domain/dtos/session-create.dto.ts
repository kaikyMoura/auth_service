/**
 * Session create dto
 * @description This dto is used to create a session
 */
export class SessionCreateDto {
  constructor(
    public readonly userId: string,
    public readonly refreshToken: string,
    public readonly userAgent: string,
    public readonly ipAddress: string,
    public readonly isActive?: boolean,
    public readonly expiresAt?: Date,
  ) {}
}
