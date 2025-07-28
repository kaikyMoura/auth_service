import { LoggerService } from '@/infra/logger/logger.service';
import { SESSION_REPOSITORY } from '@/modules/sessions/domain/interfaces/session.tokens';
import { Inject, Injectable } from '@nestjs/common';
import { SessionCreateDto } from '../../domain/dtos/session-create.dto';
import { SessionUpdateDto } from '../../domain/dtos/session-update.dto';
import { SessionEntity } from '../../domain/entities/session.entity';
import { ISessionService } from '../../domain/interfaces/session-service.interface';
import { SessionRepository } from '../../domain/repositories/session.repository';

/**
 * Session service
 * @class SessionService
 * @description Session service for session management
 */
@Injectable()
export class SessionService implements ISessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Creates a new session
   * @param session - The session to create
   * @returns The created session
   * @example
   * const session = await this.sessionService.create({
   *     userId: '123',
   *     refreshToken: '123',
   *     isActive: true,
   * });
   */
  async create(session: SessionCreateDto): Promise<SessionEntity> {
    const context = `${this.constructor.name}.create`;

    this.logger.log('Creating session', context);
    const sessionEntity = new SessionEntity(
      session.userId,
      session.refreshToken,
      session.userAgent,
      session.ipAddress,
      session.isActive ?? true,
      session.expiresAt!,
    );

    if (sessionEntity.isExpired()) {
      this.logger.error('Cannot create expired session', context);
      throw new Error('Cannot create expired session');
    }

    const newSession = await this.sessionRepository.create(sessionEntity);
    this.logger.log('Session created', context);
    return newSession;
  }

  /**
   * Finds a unique session
   * @param id - The id of the session
   * @returns  The found session
   * @example
   * const session = await this.sessionService.findById('123');
   */
  async findById(id: string): Promise<SessionEntity | null> {
    const context = `${this.constructor.name}.findById`;
    this.logger.log('Finding unique session', context);
    const session = await this.sessionRepository.findByUserId(id);
    this.logger.log('Session found', context);
    return session;
  }

  /**
   * Finds the first session
   * @param where - The where clause to find the session
   * @param orderBy - The order by clause to order the sessions
   * @returns The found session
   * @example
   * const session = await this.sessionService.findFirst({
   *     where: {
   *         id: '123',
   *     },
   *     orderBy: {
   *         createdAt: 'desc',
   *     },
   * });
   */
  async findByUserId(userId: string): Promise<SessionEntity | null> {
    const context = `${this.constructor.name}.findFirstByUserId`;
    this.logger.log('Finding first session', context);
    const session = await this.sessionRepository.findByUserId(userId);
    this.logger.log('Session found', context);
    return session;
  }

  /**
   * Finds a session by its refresh token.
   * @param refreshToken - The refresh token to search for.
   * @returns The found session or null if not found.
   */
  async findByRefreshToken(
    refreshToken: string,
  ): Promise<SessionEntity | null> {
    const context = `${this.constructor.name}.findByRefreshToken`;
    this.logger.log('Finding session by refresh token', context);
    const session = await this.sessionRepository.findByToken(refreshToken);
    this.logger.log('Session found', context);
    return session;
  }

  /**
   * Finds many sessions
   * @param where - The where clause to find the sessions
   * @param orderBy - The order by clause to order the sessions
   * @param take - The take clause to limit the number of sessions
   * @param skip - The skip clause to skip the number of sessions
   * @returns The found sessions
   * @example
   * const sessions = await this.sessionService.findMany({
   *     where: {
   *         id: '123',
   *     },
   *     orderBy: {
   *         createdAt: 'desc',
   *     },
   *     take: 10,
   *     skip: 0,
   * });
   */
  async findMany(): Promise<SessionEntity[]> {
    const context = `${this.constructor.name}.findMany`;
    this.logger.log('Finding many sessions', context);
    const sessions = await this.sessionRepository.findAll();
    this.logger.log('Sessions found', context);
    return sessions;
  }

  /**
   * Updates a session
   * @param where - The where clause to update the session
   * @param data - The data to update the session
   * @returns The updated session
   * @example
   * await this.sessionService.update({
   *     id: '123',
   * }, {
   *     isActive: false,
   * });
   */
  async update(id: string, data: SessionUpdateDto): Promise<SessionEntity> {
    const context = `${this.constructor.name}.update`;
    this.logger.log('Updating session', context);
    const session = await this.sessionRepository.update(
      id,
      new SessionEntity(
        data.userId!,
        data.refreshToken!,
        data.userAgent!,
        data.ipAddress!,
        data.isActive ?? true,
        data.expiresAt!,
      ),
    );
    this.logger.log('Session updated', context);
    return session;
  }

  /**
   * Deletes a session by token
   * @param token - The token of the session
   * @returns The deleted session
   * @example
   * await this.sessionService.deleteByToken('123');
   */
  async deleteByToken(token: string): Promise<void> {
    const context = `${this.constructor.name}.delete`;
    this.logger.log('Deleting session', context);
    await this.sessionRepository.deleteByToken(token);
    this.logger.log('Session deleted', context);
  }

  /**
   * Deletes a session by user id
   * @param userId - The user id of the session
   * @returns The deleted session
   * @example
   * await this.sessionService.deleteByUserId('123');
   */
  async deleteByUserId(userId: string): Promise<void> {
    const context = `${this.constructor.name}.deleteExpiredSessionsByUserId`;
    this.logger.log('Deleting expired sessions', context);
    await this.sessionRepository.deleteByUserId(userId);
    this.logger.log('Expired sessions deleted', context);
  }

  async deleteExpiredSessions(): Promise<void> {
    const context = `${this.constructor.name}.deleteExpiredSessions`;
    this.logger.log('Deleting expired sessions', context);
    await this.sessionRepository.deleteExpiredSessions();
    this.logger.log('Expired sessions deleted', context);
  }

  /**
   * Deletes a session by refresh token
   * @param refreshToken - The refresh token to delete the session
   * @returns The deleted session
   * @example
   * await this.sessionService.deleteByRefreshToken('123');
   */
  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await this.sessionRepository.deleteByToken(refreshToken);
  }

  /**
   * Counts the number of sessions
   * @param userId - The user id of the session
   * @returns The number of sessions
   * @example
   * const count = await this.sessionService.count('123');
   */
  async count(userId: string): Promise<number> {
    const context = `${this.constructor.name}.count`;
    this.logger.log('Counting sessions', context);
    const count = await this.sessionRepository.count(userId);
    this.logger.log('Sessions counted', context);
    return count;
  }

  /**
   * Aggregates the sessions
   * @param userId - The id of the user
   * @returns The aggregated sessions
   * @example
   * const aggregate = await this.sessionService.aggregate({
   *     isActive: true,
   * });
   */
  async aggregate(userId: string): Promise<SessionEntity[]> {
    const context = `${this.constructor.name}.aggregate`;
    this.logger.log('Aggregating sessions', context);
    const aggregateResult = await this.sessionRepository.aggregate(userId);
    this.logger.log('Sessions aggregated', context);
    return aggregateResult;
  }

  /**
   * Checks if a session exists
   * @param token - The token of the session
   * @returns True if the session exists, false otherwise
   * @example
   * const exists = await this.sessionService.exists('123');
   */
  async exists(token: string): Promise<boolean> {
    const context = `${this.constructor.name}.exists`;
    this.logger.log('Checking if session exists', context);
    const exists = await this.sessionRepository.exists(token);
    this.logger.log('Session exists', context);
    return exists;
  }
}
