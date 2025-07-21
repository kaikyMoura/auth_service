import { LoggerService } from '@/shared/loggers/logger.service';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { async, firstValueFrom } from 'rxjs';
import { RegisterUserDto } from './dtos/register-user.dto';
import { User } from './types/user';

@Injectable()
export class UsersService {
  private readonly baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
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
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/users`, user),
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  /**
   * Find a user by email
   * @param email - The email of the user
   * @returns The user
   * @throws {HttpException} - If the user is not found
   */
  async findUserByEmail(email: string): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/users/email/${email}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  /**
   * Find a user by id
   * @param id - The id of the user
   * @returns The user
   * @throws {HttpException} - If the user is not found
   */
  async findUserById(id: string): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/users/${id}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  /**
   * Forgot password
   * @param email - The email of the user
   * @returns The user
   * @throws {HttpException} - If the user is not found
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await firstValueFrom(this.httpService.post(`${this.baseUrl}/users/forgot-password`, { email }));
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  /**
   * Reset password
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns The user
   * @throws {HttpException} - If the user is not found
   */
  async resetPassword(email: string, password: string): Promise<void> {
    try {
      await firstValueFrom(this.httpService.post(`${this.baseUrl}/users/reset-password`, { email, password }));
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  /**
   * Validate credentials
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns The user
   * @throws {HttpException} - If the user is not found
   */
  async validateCredentials(email: string, password: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/users/validate-credentials`, {
          email,
          password,
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.response.data, error.response.status);
    }
  }
}
