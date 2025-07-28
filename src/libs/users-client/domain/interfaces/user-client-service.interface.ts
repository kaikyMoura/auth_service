import { RegisterUserDto } from '@/application/dtos/register-user.dto';
import { User } from '../types/user';

/**
 * User client service interface
 * @description This is the interface for the user client service
 * @returns User client service interface
 */
export interface IUserClientService {
  /**
   * Create a new user
   * @param user - The user to create
   * @returns The created user
   */
  createUser(user: RegisterUserDto): Promise<User>;

  /**
   * Get user cache by id
   * @param id - The id of the user
   * @returns The user
   */
  getUserCacheById(id: string): Promise<User | undefined>;

  /**
   * Get user cache by email
   * @param email - The email of the user
   * @returns The user
   */
  getUserCacheByEmail(email: string): Promise<User | undefined>;

  /**
   * Find user by id
   * @param id - The id of the user
   * @returns The user
   */
  findUserById(id: string): Promise<User | undefined>;

  /**
   * Find user by email
   * @param email - The email of the user
   * @returns The user
   */
  findUserByEmail(email: string): Promise<User | undefined>;

  /**
   * Set user cache
   * @param id - The id of the user
   * @param user - The user to set
   * @param refreshToken - The refresh token to set
   * @param ttl - The ttl of the cache
   */
  setUserCache(
    id: string,
    user: User,
    refreshToken?: string,
    ttl?: number,
  ): Promise<void>;

  /**
   * Invalidate user cache
   * @param id - The id of the user
   */
  invalidateUserCache(id: string): Promise<void>;

  /**
   * Validate credentials
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns The user
   */
  validateCredentials(email: string, password: string): Promise<string>;
}
