import { SessionCreateDto } from '../dtos/session-create.dto';
import { SessionUpdateDto } from '../dtos/session-update.dto';
import { SessionEntity } from '../entities/session.entity';

/**
 * Session service interface
 * @description This interface is used to define the methods that must be implemented by the session service
 */
export interface ISessionService {
  /**
   * Create a new session
   * @param session - The session to create
   * @returns The created session
   */
  create(session: SessionCreateDto): Promise<SessionEntity>;

  /**
   * Find a session by user id
   * @param userId - The user id of the session
   * @returns The session
   */
  findByUserId(userId: string): Promise<SessionEntity | null>;

  /**
   * Find a session by refresh token
   * @param refreshToken - The refresh token of the session
   * @returns The session
   */
  findByRefreshToken(refreshToken: string): Promise<SessionEntity | null>;

  /**
   * Find many sessions
   * @returns The sessions
   */
  findMany(): Promise<SessionEntity[]>;

  /**
   * Update a session
   * @param id - The id of the session
   * @param data - The data to update the session
   * @returns The updated session
   */
  update(id: string, data: SessionUpdateDto): Promise<SessionEntity>;

  /**
   * Delete a session
   * @param token - The token of the session
   * @returns The deleted session
   */
  deleteByToken(token: string): Promise<void>;

  /**
   * Delete a session by user id
   * @param userId - The user id of the session
   * @returns The deleted session
   */
  deleteByUserId(userId: string): Promise<void>;

  /**
   * Delete expired sessions
   * @returns The deleted sessions
   */
  deleteExpiredSessions(): Promise<void>;

  /**
   * Count sessions
   * @param userId - The user id of the session
   * @returns The number of sessions
   */
  count(userId: string): Promise<number>;

  /**
   * Aggregate sessions
  /**
   * Aggregate sessions
   * @param userId - The user id of the session
   * @returns The aggregated sessions
   */
  aggregate(userId: string): Promise<SessionEntity[]>;

  /**
   * Check if a session exists
   * @param token - The token of the session
   * @returns True if the session exists, false otherwise
   */
  exists(token: string): Promise<boolean>;
}
