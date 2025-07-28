/**
 * Session update dto
 * @description This dto is used to update a session
 */
export class SessionUpdateDto {
  constructor(
    public readonly id?: string,
    public readonly refreshToken?: string,
    public readonly userAgent?: string,
    public readonly ipAddress?: string,
    public readonly userId?: string,
    public readonly isActive?: boolean,
    public readonly expiresAt?: Date,
    public readonly isExpired?: boolean,
    public readonly lastUsedAt?: Date,
  ) {}
}
