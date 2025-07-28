import { RegisterUserDto } from '@/application/dtos/register-user.dto';
import { LoggerService } from '@/infra/logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IUserClientService } from '../../domain/interfaces/user-client-service.interface';
import { User } from '../../domain/types/user';

/**
 * User client service
 * @description This service is used to interact with the users service
 */
@Injectable()
export class UserClientService implements IUserClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.baseUrl =
      this.configService.get('USERS_SERVICE_URL') ?? 'http://localhost:3000';
  }

  /**
   * Create a new user
   * @param user - The user to create
   * @returns The created user
   * @throws {HttpException} - If the user creation fails
   */
  async createUser(user: RegisterUserDto): Promise<User> {
    this.logger.log(`Creating user ${user.email}`);
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/users`, user),
    );

    this.logger.log(`User created ${JSON.stringify(response.data)}`);
    return response.data as User;
  }

  /**
   * Find a user by email
   * @param email - The email of the user
   * @returns The user
   * @throws {HttpException} - If the user is not found
   */
  async findUserByEmail(email: string): Promise<User> {
    this.logger.log(`Finding user by email ${email}`);
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/users/email/${encodeURIComponent(email)}`,
      ),
    );

    this.logger.log(`User found ${JSON.stringify(response.data)}`);
    return response.data as User;
  }

  /**
   * Find a user by id
   * @param id - The id of the user
   * @returns The user
   * @throws {HttpException} - If the user is not found
   */
  async findUserById(id: string): Promise<User> {
    this.logger.log(`Finding user by id ${id}`);
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/users/${id}`),
    );

    this.logger.log(`User found ${JSON.stringify(response.data)}`);
    return response.data as User;
  }

  /**
   * Forgot password
   * @param email - The email of the user
   * @returns The user
   * @throws {HttpException} - If the user is not found
   */
  async forgotPassword(email: string): Promise<void> {
    await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/users/forgot-password`, {
        email,
      }),
    );
  }

  /**
   * Reset password
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns The user
   * @throws {HttpException} - If the user is not found
   */
  async resetPassword(email: string, password: string): Promise<void> {
    await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/users/reset-password`, {
        email,
        password,
      }),
    );
  }

  /**
   * Validate credentials
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns The a message of success or error
   * @throws {HttpException} - If the user is not found
   */
  async validateCredentials(email: string, password: string): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/users/validate-credentials`, {
        email,
        password,
      }),
    );
    return response.data as string;
  }

  /**
   * Get a user from the cache
   * @param id - The id of the user
   * @returns The user
   */
  async getUserCacheByEmail(email: string): Promise<User | undefined> {
    return await this.cacheManager.get<User & { refreshToken?: string }>(
      `user:${email}`,
    );
  }

  /**
   * Get a user from the cache by id
   * @param id - The id of the user
   * @returns The user
   */
  async getUserCacheById(id: string): Promise<User | undefined> {
    return await this.cacheManager.get<User & { refreshToken?: string }>(
      `user:${id}`,
    );
  }

  /**
   * Set a user in the cache
   * @param id - The id of the user
   * @param user - The user
   * @param refreshToken - The refresh token of the user
   * @param ttl - The time to live in seconds
   */
  async setUserCache(
    id: string,
    user: User,
    refreshToken?: string,
    ttl?: number,
  ): Promise<void> {
    const cachedData = { ...user, refreshToken };
    await this.cacheManager.set(`user:${id}`, cachedData, ttl ?? 60 * 60 * 24);
  }

  /**
   * Invalidate a user from the cache
   * @param id - The id of the user
   */
  async invalidateUserCache(id: string): Promise<void> {
    await this.cacheManager.del(`user:${id}`);
  }
}
