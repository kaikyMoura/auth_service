/**
 * Session entity
 * @description This entity is used to represent a session
 */
export class SessionEntity {
  constructor(
    public readonly userId: string,
    public readonly refreshToken: string,
    public readonly userAgent: string,
    public readonly ipAddress: string,
    public readonly isActive: boolean,
    public readonly expiresAt: Date,
    public readonly id?: string,
    public readonly createdAt?: Date,
    public readonly lastUsedAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  /**
   * Check if the session is expired
   * @returns True if the session is expired, false otherwise
   */
  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    return this.expiresAt < new Date();
  }
}
