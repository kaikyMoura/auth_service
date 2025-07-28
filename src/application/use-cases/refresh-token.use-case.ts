import { AuthTokens } from '@/application/dtos/auth-tokens.dto';
import { TokenGeneratorService } from '@/application/services/token-generator.service';
import { TokenService } from '@/application/services/token.service';
import { LoggerService } from '@/infra/logger/logger.service';
import { IUserClientService } from '@/libs/users-client/domain/interfaces/user-client-service.interface';
import { USER_CLIENT_SERVICE } from '@/libs/users-client/domain/interfaces/user-client.tokens';
import { ISessionService } from '@/modules/sessions/domain/interfaces/session-service.interface';
import { SESSION_SERVICE } from '@/modules/sessions/domain/interfaces/session.tokens';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

/**
 * The refresh token use case
 * @description This use case is responsible for refreshing a user's authentication tokens
 * @param refreshToken - The refresh token
 */
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(USER_CLIENT_SERVICE)
    private readonly userClientService: IUserClientService,
    @Inject(SESSION_SERVICE)
    private readonly sessionService: ISessionService,
    private readonly tokenGeneratorService: TokenGeneratorService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Execute the refresh token use case
   * @param refreshToken - The refresh token
   * @returns The authentication tokens
   */
  async execute(refreshToken: string): Promise<AuthTokens> {
    const context = `${this.constructor.name}.${this.execute.name}`;
    this.logger.log('Refresh token attempt', context);

    // Verify refresh token
    await this.tokenService.verifyToken(refreshToken);

    // Find active session
    const session = await this.sessionService.findByRefreshToken(refreshToken);

    if (!session || !session.isActive || !session.id) {
      this.logger.warn('Invalid or expired session for refresh token', context);
      throw new UnauthorizedException('Invalid or expired session.');
    }

    // Get user data
    let user = await this.userClientService.getUserCacheById(session.userId);
    user ??= await this.userClientService.findUserById(session.userId);

    if (!user?.isActive) {
      this.logger.warn('Inactive user account for refresh token', context);
      throw new UnauthorizedException('Inactive user account');
    }

    // Update session last used
    await this.sessionService.update(session.id, {
      lastUsedAt: new Date(),
    });

    // Generate new tokens using the specialized service
    const tokens = await this.tokenGeneratorService.generateTokens(
      user,
      session.id,
    );

    // Update cache with new refresh token
    await this.userClientService.setUserCache(
      user.id,
      user,
      tokens.refreshToken,
    );

    this.logger.log(`Token refreshed successfully for ${user.email}`, context);

    return tokens;
  }
}
