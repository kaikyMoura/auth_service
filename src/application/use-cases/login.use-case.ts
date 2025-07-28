import { AuthTokens } from '@/application/dtos/auth-tokens.dto';
import { LoginUserDto } from '@/application/dtos/login-user.dto';
import { RateLimitService } from '@/application/services/rate-limit.service';
import { TokenGeneratorService } from '@/application/services/token-generator.service';
import { LoggerService } from '@/infra/logger/logger.service';
import { IUserClientService } from '@/libs/users-client/domain/interfaces/user-client-service.interface';
import { USER_CLIENT_SERVICE } from '@/libs/users-client/domain/interfaces/user-client.tokens';
import { ISessionService } from '@/modules/sessions/domain/interfaces/session-service.interface';
import { SESSION_SERVICE } from '@/modules/sessions/domain/interfaces/session.tokens';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Login use case
 * @description This use case is responsible for logging in a user
 * @param loginUserDto - The login user dto
 * @param ipAddress - The ip address
 * @param userAgent - The user agent
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_CLIENT_SERVICE)
    private readonly userClientService: IUserClientService,
    @Inject(SESSION_SERVICE)
    private readonly sessionService: ISessionService,
    private readonly tokenGeneratorService: TokenGeneratorService,
    private readonly logger: LoggerService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  /**
   * Execute the login use case
   * @param loginUserDto - The login user dto
   * @param ipAddress - The ip address
   * @param userAgent - The user agent
   * @returns The auth tokens
   */
  async execute(
    loginUserDto: LoginUserDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const context = `${this.constructor.name}.${this.execute.name}`;

    this.logger.log(`Login attempt for ${loginUserDto.email}`, context);

    // Check rate limiting
    this.rateLimitService.checkRateLimit(loginUserDto.email);

    // Find user
    let user = await this.userClientService.findUserByEmail(loginUserDto.email);
    if (!user) {
      this.rateLimitService.recordFailedAttempt(loginUserDto.email);
      this.logger.error(
        `Invalid credentials for user ${loginUserDto.email}`,
        context,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    // Clear rate limit on successful user found
    this.rateLimitService.clearRateLimit(loginUserDto.email);

    // Check if user is active
    if (!user.isActive) {
      this.logger.error(`Inactive user ${loginUserDto.email}`, context);
      throw new BadRequestException(
        'Your account is not active. Please verify your email.',
      );
    }

    // Validate credentials
    const validCredentials = await this.userClientService.validateCredentials(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!validCredentials) {
      this.rateLimitService.recordFailedAttempt(loginUserDto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Clean up expired sessions
    await this.sessionService.deleteByUserId(user.id);

    // Get cached user data if available
    const cachedUser = await this.userClientService.getUserCacheById(user.id);
    if (cachedUser) {
      user = { ...user, ...cachedUser };
    } else {
      await this.userClientService.setUserCache(user.id, user);
    }

    // Create session
    const sessionExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const newSession = await this.sessionService.create({
      userId: user.id,
      refreshToken: '',
      isActive: true,
      ipAddress: ipAddress ?? '',
      userAgent: userAgent ?? '',
      expiresAt: sessionExpiration,
    });

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

    this.logger.log(`Login successful for ${user.email}`, context);

    return tokens;
  }
}
