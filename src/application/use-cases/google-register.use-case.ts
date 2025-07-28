import { AuthTokens } from '@/application/dtos/auth-tokens.dto';
import { TokenGeneratorService } from '@/application/services/token-generator.service';
import { IClientInfo } from '@/domain/interfaces/client-info.interface';
import { GoogleAuthService } from '@/infra/google-auth/google-auth.service';
import { LoggerService } from '@/infra/logger/logger.service';
import { IUserClientService } from '@/libs/users-client/domain/interfaces/user-client-service.interface';
import { USER_CLIENT_SERVICE } from '@/libs/users-client/domain/interfaces/user-client.tokens';
import { ISessionService } from '@/modules/sessions/domain/interfaces/session-service.interface';
import { SESSION_SERVICE } from '@/modules/sessions/domain/interfaces/session.tokens';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';

/**
 * The Google register use case
 * @description This use case is responsible for registering a user with Google
 */
@Injectable()
export class GoogleRegisterUseCase {
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
   * Execute the Google register use case
   * @param token - The Google ID token
   * @param clientInfo - The client information (IP, User Agent)
   * @returns The authentication tokens
   */
  async execute(token: string, clientInfo?: IClientInfo): Promise<AuthTokens> {
    const context = `${this.constructor.name}.${this.execute.name}`;

    this.logger.log('Google register attempt', context);

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

    // Check if user already exists
    let existingUser = await this.userClientService.getUserCacheByEmail(
      payload.email,
    );
    existingUser ??= await this.userClientService.findUserByEmail(
      payload.email,
    );
    existingUser ??= await this.userClientService.findUserByEmail(
      payload.email,
    );

    if (existingUser) {
      this.logger.error(
        `User already exists for email: ${payload.email}`,
        context,
      );
      throw new ConflictException(
        'This email is already in use. Try to login instead.',
      );
    }

    // Create new user
    this.logger.log(`Creating new user for email: ${payload.email}`, context);

    const newUser = await this.userClientService.createUser({
      email: payload.email,
      firstName: payload.given_name ?? '',
      lastName: payload.family_name ?? '',
      avatar: payload.picture,
      provider: 'google',
      // Generate a random password for Google users
      password: this.generateRandomPassword(),
    });

    this.logger.log(`User created successfully: ${newUser.id}`, context);

    // Create session
    const sessionExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const newSession = await this.sessionService.create({
      userId: newUser.id,
      refreshToken: '',
      isActive: true,
      ipAddress: clientInfo?.ipAddress ?? '',
      userAgent: clientInfo?.userAgent ?? '',
      expiresAt: sessionExpiration,
    });

    this.logger.log(`Session created: ${newSession.id}`, context);

    // Generate tokens using the specialized service
    const tokens = await this.tokenGeneratorService.generateTokens(
      newUser,
      newSession.id!,
    );

    // Update session with refresh token
    await this.sessionService.update(newSession.id!, {
      refreshToken: tokens.refreshToken,
    });

    // Update cache with refresh token
    await this.userClientService.setUserCache(
      newUser.id,
      newUser,
      tokens.refreshToken,
    );

    this.logger.log(`Google register successful for ${newUser.email}`, context);

    return tokens;
  }

  private generateRandomPassword(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
