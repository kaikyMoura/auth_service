import { AuthTokens } from '@/application/dtos/auth-tokens.dto';
import { TokenGeneratorService } from '@/application/services/token-generator.service';
import { IClientInfo } from '@/domain/interfaces/client-info.interface';
import { GoogleAuthService } from '@/infra/google-auth/google-auth.service';
import { LoggerService } from '@/infra/logger/logger.service';
import { IUserClientService } from '@/libs/users-client/domain/interfaces/user-client-service.interface';
import { USER_CLIENT_SERVICE } from '@/libs/users-client/domain/interfaces/user-client.tokens';
import { SessionEntity } from '@/modules/sessions/domain/entities/session.entity';
import { ISessionService } from '@/modules/sessions/domain/interfaces/session-service.interface';
import { SESSION_SERVICE } from '@/modules/sessions/domain/interfaces/session.tokens';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * The Google login use case
 * @description This use case is responsible for logging in a user with Google
 */
@Injectable()
export class GoogleLoginUseCase {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    @Inject(USER_CLIENT_SERVICE)
    private readonly userClientService: IUserClientService,
    @Inject(SESSION_SERVICE)
    private readonly sessionService: ISessionService,
    private readonly tokenGeneratorService: TokenGeneratorService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Execute the Google login use case
   * @param token - The Google ID token
   * @param clientInfo - The client information (IP, User Agent)
   * @returns The authentication tokens
   */
  async execute(token: string, clientInfo?: IClientInfo): Promise<AuthTokens> {
    const context = `${this.constructor.name}.${this.execute.name}`;

    this.logger.log('Google login attempt', context);

    // Verify Google token
    const payload = await this.googleAuthService.verifyToken(token);
    if (!payload?.email) {
      this.logger.error('Invalid Google token - no email found', context);
      throw new BadRequestException('Invalid Google token');
    }

    this.logger.log(
      `Google token verified for email: ${payload.email}`,
      context,
    );

    // Find user by email
    let user = await this.userClientService.getUserCacheByEmail(payload.email);
    user ??= await this.userClientService.findUserByEmail(payload.email);

    if (!user) {
      this.logger.error(
        `No account found for email: ${payload.email}`,
        context,
      );
      throw new UnauthorizedException(
        'No account found with this email. Please register first.',
      );
    }

    if (!user.isActive) {
      this.logger.error(`Inactive user: ${payload.email}`, context);
      throw new BadRequestException('Your account is not active.');
    }

    this.logger.log(`User found: ${user.email}`, context);

    // Clean up expired sessions
    await this.sessionService.deleteByUserId(user.id);

    // Create new session
    const sessionExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = new SessionEntity(
      user.id,
      '',
      clientInfo?.userAgent ?? '',
      clientInfo?.ipAddress ?? '',
      true,
      sessionExpiration,
    );

    const newSession = await this.sessionService.create(session);

    this.logger.log(`Session created: ${newSession.id}`, context);

    // Generate tokens using the specialized service
    const tokens = await this.tokenGeneratorService.generateTokens(
      user,
      newSession.id!,
    );

    // Update session with refresh token
    await this.sessionService.update(newSession.id!, {
      refreshToken: tokens.refreshToken,
    });

    // Update cache with refresh token
    await this.userClientService.setUserCache(
      user.id,
      user,
      tokens.refreshToken,
    );

    this.logger.log(`Google login successful for ${user.email}`, context);

    return tokens;
  }
}
