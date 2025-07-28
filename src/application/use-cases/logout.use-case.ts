import { LoggerService } from '@/infra/logger/logger.service';
import { IUserClientService } from '@/libs/users-client/domain/interfaces/user-client-service.interface';
import { USER_CLIENT_SERVICE } from '@/libs/users-client/domain/interfaces/user-client.tokens';
import { ISessionService } from '@/modules/sessions/domain/interfaces/session-service.interface';
import { SESSION_SERVICE } from '@/modules/sessions/domain/interfaces/session.tokens';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

/**
 * Logout use case
 * @description This use case is responsible for logging out a user
 * @param refreshToken - The refresh token
 */
@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(SESSION_SERVICE)
    private readonly sessionService: ISessionService,
    @Inject(USER_CLIENT_SERVICE)
    private readonly userClientService: IUserClientService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Execute the logout use case
   * @param refreshToken - The refresh token
   */
  async execute(refreshToken: string): Promise<void> {
    const context = `${this.constructor.name}.${this.execute.name}`;
    this.logger.log('Logout attempt', context);

    // Find session by refresh token
    const session = await this.sessionService.findByRefreshToken(refreshToken);
    if (!session) {
      this.logger.warn('Session not found for logout', context);
      throw new NotFoundException('Session not found');
    }

    // Delete session
    await this.sessionService.deleteByToken(refreshToken);

    // Invalidate user cache
    await this.userClientService.invalidateUserCache(session.userId);

    this.logger.log(`Logout successful for user ${session.userId}`, context);
  }
}
