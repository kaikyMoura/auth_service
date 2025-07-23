import { GoogleAuthService } from '@/google/auth/google-auth.service';
import { SessionService } from '@/sessions/session.service';
import { LoggerService } from '@/shared/loggers/logger.service';
import { LoginUserDto } from '@/users-client/dtos/login-user.dto';
import { RegisterUserDto } from '@/users-client/dtos/register-user.dto';
import { User } from '@/users-client/types/user';
import { UserClientService } from '@/users-client/user-client.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthTokens } from '../types/auth-tokens';
import { TokenService } from './token.service';

/**
 * Auth service
 * @class AuthService
 * @description Auth service for authentication and authorization
 * @example
 * const authService = new AuthService(sessionService, logger);
 */
@Injectable()
export class AuthService {
  private readonly maxLoginAttempts = 5;
  private readonly lockoutDuration = 15 * 60 * 1000;
  private readonly loginAttempts = new Map<
    string,
    { count: number; lastAttempt: Date }
  >();

  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UserClientService,
    private readonly logger: LoggerService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Login a user
   * @param email - The email of the user
   * @param password - The password of the user
   * @param ipAddress - The ip address of the user
   * @param userAgent - The user agent of the user
   * @returns The token
   * @throws {BadRequestException} - If the user is not found
   */
  async login(
    loginUserDto: LoginUserDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    this.checkRateLimit(loginUserDto.email);

    let user = await this.usersService.findUserByEmail(loginUserDto.email);
    if (!user) {
      this.recordFailedAttempt(loginUserDto.email);
      this.logger.error(`Invalid credentials for user ${loginUserDto.email}`);
      throw new BadRequestException('Invalid credentials');
    }

    this.loginAttempts.delete(loginUserDto.email);
    await this.sessionService.deleteExpiredSessionsByUserId(user.id);

    if (!user.isActive) {
      this.logger.error(`Inactive user ${loginUserDto.email}`);
      throw new BadRequestException(
        'Your account is not active. Please verify your email.',
      );
    }

    this.logger.log(`User found: ${user.email}`);
    const validCredentials = await this.usersService.validateCredentials(
      loginUserDto.email,
      loginUserDto.password,
    );

    this.logger.log(`Valid credentials: ${validCredentials}`);
    if (!validCredentials) {
      this.recordFailedAttempt(loginUserDto.email);
      throw new BadRequestException('Invalid credentials');
    }

    const cachedUser = await this.usersService.getUserCacheById(user.id);
    if (cachedUser) {
      user = { ...user, ...cachedUser };
    } else {
      await this.usersService.setUserCache(user.id, user);
    }

    this.logger.log(`Generating tokens for user ${user.email}`);
    const accessToken = await this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role ?? undefined,
    });

    this.logger.log(`Access token: ${accessToken.token}`);
    const refreshToken = await this.tokenService.signRefreshToken();
    this.logger.log(`Refresh token: ${refreshToken.token}`);

    await this.usersService.setUserCache(user.id, user, refreshToken.token);

    const session = await this.sessionService.create({
      userId: user.id,
      refreshToken: refreshToken.token,
      ipAddress: ipAddress ?? undefined,
      userAgent: userAgent ?? undefined,
      isActive: true,
      expiresAt: new Date(Date.now() + Number(refreshToken.expiresIn) * 1000),
    });

    this.logger.log(`Session created: ${session.id}`);
    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresIn: Number(refreshToken.expiresIn),
    };
  }

  /**
   * Google login
   * @param token - The token to login
   * @param ipAddress - The ip address of the user
   * @param userAgent - The user agent of the user
   * @returns The tokens
   */
  async googleLogin(
    token: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const payload = await this.googleAuthService.verifyToken(token);

    this.logger.log(`Google login payload: ${JSON.stringify(payload)}`);

    let user = await this.usersService.getUserCacheByEmail(payload.email!);
    if (!user) {
      user = await this.usersService.findUserByEmail(payload.email!);
      this.logger.error(
        `No account found with this email: ${payload.email}`,
        'AuthService.googleLogin',
      );
      throw new UnauthorizedException(
        'No account found with this email. Please register first.',
      );
    }

    if (!user.isActive) {
      this.logger.error(
        `Inactive user: ${payload.email}`,
        'AuthService.googleLogin',
      );
      throw new BadRequestException('Your account is not active.');
    }

    this.logger.log(`User found: ${user.email}`);
    const session = await this.sessionService.create({
      userId: user.id,
      refreshToken: '',
      isActive: true,
      ipAddress: ipAddress ?? undefined,
      userAgent: userAgent ?? undefined,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    this.logger.log(`Session created: ${session.id}`);
    const tokens = await this.generateTokens(user, session.id);

    this.logger.log(`Tokens generated: ${JSON.stringify(tokens)}`);
    await this.usersService.setUserCache(user.id, user, tokens.refreshToken);

    this.logger.log(`Session updated: ${session.id}`);
    await this.sessionService.update(
      { id: session.id },
      { refreshToken: tokens.refreshToken },
    );

    this.logger.log(`Session updated: ${session.id}`);
    return tokens;
  }

  /**
   * Google callback
   * @param token - The token to callback
   * @returns The tokens
   */
  async googleCallback(token: string): Promise<AuthTokens> {
    const payload = await this.googleAuthService.verifyToken(token);
    const user = await this.usersService.findUserByEmail(payload.email!);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const session = await this.sessionService.findUnique({
      userId: user.id,
      id: undefined,
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const tokens = await this.generateTokens(user, session.id);

    return tokens;
  }

  /**
   * Google signup
   * @param token - The token to signup
   * @returns The tokens
   */
  async googleSignup(
    token: string,
    password?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens | { redirectToCompleteProfile: boolean }> {
    this.logger.log(
      `Google signup with token: ${token}`,
      'AuthService.googleSignup',
    );
    const payload = await this.googleAuthService.verifyToken(token);
    const email = payload?.email;
    if (!email) {
      this.logger.error('Invalid Google token', 'AuthService.googleSignup');
      throw new BadRequestException('Invalid Google token');
    }

    let user = await this.usersService.getUserCacheByEmail(email);
    if (!user) {
      this.logger.log(
        `No user found in cache for email: ${email}`,
        'AuthService.googleSignup',
      );
      user = await this.usersService.findUserByEmail(email);

      if (user) {
        this.logger.error(
          `User already exists for email: ${email}`,
          'AuthService.googleSignup',
        );
        throw new UnauthorizedException(
          'This email is already in use. Try to login instead.',
        );
      }

      if (!password) {
        this.logger.log(
          `No password provided, redirecting to complete profile`,
          'AuthService.googleSignup',
        );
        return { redirectToCompleteProfile: true };
      }

      user = await this.usersService.createUser({
        email,
        password,
        firstName: payload.given_name ?? '',
        lastName: payload.family_name ?? '',
        avatar: payload.picture ?? undefined,
        provider: 'google',
      });
    }

    this.logger.log(`User created: ${user.id}`, 'AuthService.googleSignup');

    const session = await this.sessionService.create({
      userId: user.id,
      refreshToken: '',
      isActive: true,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    this.logger.log(
      `Session created: ${session.id}`,
      'AuthService.googleSignup',
    );

    const tokens = await this.generateTokens(user, session.id);
    this.logger.log(
      `Tokens generated: ${JSON.stringify(tokens)}`,
      'AuthService.googleSignup',
    );

    await this.sessionService.update(
      { id: session.id },
      { refreshToken: tokens.refreshToken },
    );

    this.logger.log(
      `Session updated: ${session.id}`,
      'AuthService.googleSignup',
    );

    return tokens;
  }

  /**
   * Registers a new user and generates authentication tokens.
   * @param registerUserDto - DTO containing user registration data.
   * @returns AuthTokens - Access and refresh tokens for the registered user.
   * @throws ConflictException - If the email is already registered.
   */
  async register(registerUserDto: RegisterUserDto): Promise<AuthTokens> {
    const { email } = registerUserDto;

    const existingUser = await this.usersService.findUserByEmail(email);

    if (existingUser) {
      this.logger.warn(`Attempt to register with existing email: ${email}`);
      throw new ConflictException(
        'This email is already in use. Try to login instead.',
      );
    }

    this.logger.log(`Registering new user: ${email}`);
    const newUser = await this.usersService.createUser(registerUserDto);
    this.logger.log(`User created successfully: ${newUser.id}`);

    const sessionExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = await this.sessionService.create({
      userId: newUser.id,
      refreshToken: '',
      isActive: true,
      expiresAt: sessionExpiration,
    });

    const tokens = await this.generateTokens(newUser, session.id);

    await this.sessionService.update(
      { id: session.id },
      { refreshToken: tokens.refreshToken },
    );

    this.logger.log(`Session and tokens initialized for user: ${newUser.id}`);

    return tokens;
  }

  /**
   * Logout a user
   * @param refreshToken - The refresh token of the user
   * @returns The logged out user
   * @throws {NotFoundException} - If the session is not found
   * @throws {InternalServerErrorException} - If the session deletion fails
   */
  async logout(refreshToken: string): Promise<void> {
    const session = await this.sessionService.findByRefreshToken(refreshToken);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    await this.sessionService.deleteByRefreshToken(refreshToken);
    // Invalida o cache do usuário ao fazer logout
    await this.usersService.invalidateUserCache(session.userId);
  }

  /**
   * Refresh token
   * @param refreshToken - The refresh token of the user
   * @returns The refreshed token
   * @throws {UnauthorizedException} - If the session is invalid or expired
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const payload = await this.tokenService.verifyToken(refreshToken);
    const session = await this.sessionService.findUnique({
      userId: payload.sub,
      id: undefined,
    });
    if (!session || !session.isActive || !session.id) {
      throw new UnauthorizedException('Invalid or expired session.');
    }

    let user = await this.usersService.getUserCacheById(session.userId);
    if (!user) {
      user = await this.usersService.findUserById(session.userId);
      this.logger.error(
        `No user found with id: ${session.userId}`,
        'AuthService.refreshToken',
      );
      throw new UnauthorizedException('Inactive user account');
    }
    if (!user || !user.isActive) {
      this.logger.error(
        `Inactive user: ${session.userId}`,
        'AuthService.refreshToken',
      );
      throw new UnauthorizedException('Inactive user account');
    }

    this.logger.log(`User found: ${user.email}`);
    await this.sessionService.update(
      { id: session.id },
      {
        lastUsedAt: new Date(),
      },
    );

    const tokens = await this.generateTokens(user, session.id);
    await this.usersService.setUserCache(user.id, user, tokens.refreshToken);

    this.logger.log(`Tokens generated: ${JSON.stringify(tokens)}`);
    return tokens;
  }

  /**
   * Generate tokens
   * @param user - The user to generate tokens
   * @param sessionId - The session id
   * @returns The generated tokens
   */
  async generateTokens(user: User, sessionId: string): Promise<AuthTokens> {
    this.logger.log(`Generating tokens for user: ${user.email}`);
    const payload = {
      id: user.id,
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: sessionId,
    };

    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES',
      '15m',
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES',
      '7d',
    );

    this.logger.log(`Access token expires in: ${accessTokenExpiresIn}`);
    this.logger.log(`Refresh token expires in: ${refreshTokenExpiresIn}`);

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload, accessTokenExpiresIn),
      this.tokenService.signRefreshToken(refreshTokenExpiresIn),
    ]);

    this.logger.log(`Access token: ${accessToken.token}`);
    this.logger.log(`Refresh token: ${refreshToken.token}`);

    const decodedAccess = await this.tokenService.decodeToken(
      accessToken.token,
    );
    const decodedRefresh = await this.tokenService.decodeToken(
      refreshToken.token,
    );

    this.logger.log(`Decoded access: ${JSON.stringify(decodedAccess)}`);
    this.logger.log(`Decoded refresh: ${JSON.stringify(decodedRefresh)}`);

    const expiresIn =
      [decodedAccess?.exp, decodedRefresh?.exp]
        .filter(Boolean)
        .sort((a, b) => b! - a!)[0] ?? 0; // Get the highest expiration time

    this.logger.log(`Expires in: ${expiresIn}`);
    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresIn,
    };
  }

  /**
   * Check the rate limit
   * @param key - The key to check the rate limit
   * @returns The rate limit
   */
  private checkRateLimit(key: string): void {
    this.logger.log(`Checking rate limit for ${key}`);

    const attempts = this.loginAttempts.get(key);
    this.logger.log(`Attempts: ${JSON.stringify(attempts, null, 2)}`);
    if (attempts && attempts.count >= this.maxLoginAttempts) {
      this.logger.log(
        `Too many login attempts. Locking out for ${this.lockoutDuration}ms`,
      );

      const timeSinceLockout = Date.now() - attempts.lastAttempt.getTime();
      this.logger.log(`Time since lockout: ${timeSinceLockout}ms`);

      if (timeSinceLockout < this.lockoutDuration) {
        const remainingTime = Math.ceil(
          (this.lockoutDuration - timeSinceLockout) / 1000,
        );
        this.logger.log(`Remaining time: ${remainingTime}s`);
        throw new BadRequestException(
          `Too many login attempts. Please try again in ${remainingTime} seconds.`,
        );
      } else {
        this.loginAttempts.delete(key);
        this.logger.log(`Lockout removed for ${key}`);
      }
    }
  }

  /**
   * Record a failed attempt
   * @param key - The key to record the attempt
   * @returns The recorded attempt
   */
  private recordFailedAttempt(key: string): void {
    this.logger.log(`Recording failed attempt for ${key}`);
    const attempts = this.loginAttempts.get(key) || {
      count: 0,
      lastAttempt: new Date(),
    };
    attempts.count++;
    attempts.lastAttempt = new Date();
    this.loginAttempts.set(key, attempts);
    this.logger.log(`Recorded failed attempt for ${key}`);
  }

  /**
   * Extract client info from request
   * @param req - The request
   * @returns The client info
   */
  extractClientInfo(req: Request): { ipAddress?: string; userAgent?: string } {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const ipAddress =
      xForwardedFor?.toString().split(',')[0].trim() ??
      req.socket.remoteAddress ??
      undefined;
    const userAgent = req.headers['user-agent'] ?? undefined;
    return { ipAddress, userAgent };
  }
}
