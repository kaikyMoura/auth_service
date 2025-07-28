import { AuthTokens } from '@/application/dtos/auth-tokens.dto';
import { RegisterUserDto } from '@/application/dtos/register-user.dto';
import { TokenGeneratorService } from '@/application/services/token-generator.service';
import { LoggerService } from '@/infra/logger/logger.service';
import { IUserClientService } from '@/libs/users-client/domain/interfaces/user-client-service.interface';
import { USER_CLIENT_SERVICE } from '@/libs/users-client/domain/interfaces/user-client.tokens';
import { ISessionService } from '@/modules/sessions/domain/interfaces/session-service.interface';
import { SESSION_SERVICE } from '@/modules/sessions/domain/interfaces/session.tokens';
import { ConflictException, Inject, Injectable } from '@nestjs/common';

/**
 * The register use case
 * @description This use case is responsible for registering a user
 * @param registerUserDto - The register user dto
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_CLIENT_SERVICE)
    private readonly userClientService: IUserClientService,
    @Inject(SESSION_SERVICE)
    private readonly sessionService: ISessionService,
    private readonly tokenGeneratorService: TokenGeneratorService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Execute the register use case
   * @param registerUserDto - The register user dto
   */
  async execute(
    registerUserDto: RegisterUserDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const context = `${this.constructor.name}.${this.execute.name}`;
    this.logger.log(
      `Registration attempt for ${registerUserDto.email}`,
      context,
    );

    // Check if user already exists
    const existingUser = await this.userClientService.findUserByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      this.logger.warn(
        `Attempt to register with existing email: ${registerUserDto.email}`,
        context,
      );
      throw new ConflictException(
        'This email is already in use. Try to login instead.',
      );
    }

    // Create new user
    this.logger.log(`Creating new user: ${registerUserDto.email}`, context);
    const newUser = await this.userClientService.createUser(registerUserDto);
    this.logger.log(`User created successfully: ${newUser.id}`, context);

    // Create session
    const sessionExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const newSession = await this.sessionService.create({
      userId: newUser.id,
      refreshToken: '',
      isActive: true,
      ipAddress: ipAddress ?? '',
      userAgent: userAgent ?? '',
      expiresAt: sessionExpiration,
    });

    // Generate tokens using the specialized service
    const tokens = await this.tokenGeneratorService.generateTokens(
      newUser,
      newSession.id!,
    );

    // Update session with refresh token
    await this.sessionService.update(newSession.id!, {
      refreshToken: tokens.refreshToken,
    });

    this.logger.log(`Registration successful for ${newUser.email}`, context);

    return tokens;
  }
}
