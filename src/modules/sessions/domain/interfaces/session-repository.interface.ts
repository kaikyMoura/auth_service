import { SessionEntity } from '../entities/session.entity';

/**
 * Session repository interface
 * @description This interface is used to define the methods that must be implemented by the session repository
 */
export interface ISessionRepository {
  /**
   * Create a new session
   * @param session - The session to create
   * @returns The created session
   */
  create(session: SessionEntity): Promise<SessionEntity>;

  /**
   * Find a session by token
   * @param token - The token of the session
   * @returns The session
   */
  findByToken(token: string): Promise<SessionEntity | null>;

  /**
   * Delete a session by token
   * @param token - The token of the session
   */
  deleteByToken(token: string): Promise<void>;

  /**
   * Check if a session exists by token
   * @param token - The token of the session
   * @returns True if the session exists, false otherwise
   */
  exists(token: string): Promise<boolean>;

  /**
   * Count sessions
   * @param userId - The user id of the session
   * @returns The number of sessions
   */
  count(userId: string): Promise<number>;

  /**
   * Find a session by user id
   * @param userId - The user id of the session
   * @returns The session
   */
  findByUserId(userId: string): Promise<SessionEntity | null>;

  /**
   * Find all sessions
   * @returns The sessions
   */
  findAll(): Promise<SessionEntity[]>;

  /**
   * Aggregate sessions by user id
   * @param userId - The user id of the session
   * @returns The sessions
   */
  aggregate(userId: string): Promise<SessionEntity[]>;

  /**
   * Update a session
   * @param id - The id of the session
   * @param data - The data to update the session
   * @returns The updated session
   */
  update(id: string, data: SessionEntity): Promise<SessionEntity>;

  /**
   * Delete a session by user id
   * @param userId - The user id of the session
   */
  deleteByUserId(userId: string): Promise<void>;

  /**
   * Delete expired sessions
   */
  deleteExpiredSessions(): Promise<void>;
}
