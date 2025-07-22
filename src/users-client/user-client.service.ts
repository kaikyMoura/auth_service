import { LoggerService } from '@/shared/loggers/logger.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { RegisterUserDto } from './dtos/register-user.dto';
import { User } from './types/user';

@Injectable()
export class UserClientService {
  private readonly baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly cacheManager: Cache,
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
  async getUserCache(id: string): Promise<User | undefined> {
    return await this.cacheManager.get<User>(`user:${id}`);
  }
}
