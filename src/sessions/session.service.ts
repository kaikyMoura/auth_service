import { LoggerService } from '@/shared/loggers/logger.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Session } from 'prisma/app/generated/prisma/client';
import { SessionCreateDto } from './dtos/session-create.dto';
import { SessionRepository } from './session.repository';

/**
 * Session service
 * @class SessionService
 * @description Session service for session management
 * @example
 * const sessionService = new SessionService(sessionRepository, logger);
 */
@Injectable()
export class SessionService {
  constructor(
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
  async create(session: SessionCreateDto): Promise<Session> {
    this.logger.log('Creating session', 'SessionService.create');
    const newSession = await this.sessionRepository.create({
      ...session,
    });
    this.logger.log('Session created', 'SessionService.create');
    return newSession;
  }

  /**
   * Finds a unique session
   * @param where - The where clause to find the session
   * @returns The found session
   * @example
   * const session = await this.sessionService.findUnique({
   *     id: '123',
   * });
   */
  async findUnique(
    where: Prisma.SessionWhereUniqueInput,
  ): Promise<Session | null> {
    this.logger.log('Finding unique session', 'SessionService.findUnique');
    const session = await this.sessionRepository.findUnique(where);
    this.logger.log('Session found', 'SessionService.findUnique');
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
  async findFirst(
    where: Prisma.SessionWhereInput,
    orderBy: Prisma.SessionOrderByWithRelationInput,
  ): Promise<Session | null> {
    this.logger.log('Finding first session', 'SessionService.findFirst');
    const session = await this.sessionRepository.findFirst(where, orderBy);
    this.logger.log('Session found', 'SessionService.findFirst');
    return session;
  }

  /**
   * Finds a session by its refresh token.
   * @param refreshToken - The refresh token to search for.
   * @returns The found session or null if not found.
   */
  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    this.logger.log(
      'Finding session by refresh token',
      'SessionService.findByRefreshToken',
    );
    const session = await this.sessionRepository.findFirst(
      { refreshToken: refreshToken },
      { createdAt: 'desc' },
    );
    this.logger.log('Session found', 'SessionService.findByRefreshToken');
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
  async findMany(
    where: Prisma.SessionWhereInput,
    orderBy: Prisma.SessionOrderByWithRelationInput,
    take: number,
    skip: number,
  ): Promise<Session[]> {
    this.logger.log('Finding many sessions', 'SessionService.findMany');
    const sessions = await this.sessionRepository.findMany(
      where,
      orderBy,
      take,
      skip,
    );
    this.logger.log('Sessions found', 'SessionService.findMany');
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
  async update(
    where: Prisma.SessionWhereUniqueInput,
    data: Prisma.SessionUpdateInput,
  ): Promise<void> {
    this.logger.log('Updating session', 'SessionService.update');
    await this.sessionRepository.update(where, data);
    this.logger.log('Session updated', 'SessionService.update');
  }

  /**
   * Deletes a session
   * @param where - The where clause to delete the session
   * @returns The deleted session
   * @example
   * await this.sessionService.delete({
   *     id: '123',
   * });
   */
  async delete(where: Prisma.SessionWhereUniqueInput): Promise<void> {
    this.logger.log('Deleting session', 'SessionService.delete');
    await this.sessionRepository.delete(where);
    this.logger.log('Session deleted', 'SessionService.delete');
  }

  /**
   * Deletes expired sessions for a specific user.
   * @param userId - The ID of the user whose expired sessions should be deleted.
   * @returns A promise that resolves when the operation is complete.
   */
  async deleteExpiredSessionsByUserId(userId: string): Promise<void> {
    this.logger.log(
      'Deleting expired sessions',
      'SessionService.deleteExpiredSessions',
    );
    await this.sessionRepository.deleteMany({
      userId: userId,
      expiresAt: {
        lte: new Date(),
      },
    });
    this.logger.log(
      'Expired sessions deleted',
      'SessionService.deleteExpiredSessions',
    );
  }

  async deleteExpiredSessions(): Promise<void> {
    this.logger.log(
      'Deleting expired sessions',
      'SessionService.deleteExpiredSessions',
    );
    await this.sessionRepository.deleteMany({
      expiresAt: {
        lte: new Date(),
      },
    });
    this.logger.log(
      'Expired sessions deleted',
      'SessionService.deleteExpiredSessions',
    );
  }

  /**
   * Deletes a session by refresh token
   * @param refreshToken - The refresh token to delete the session
   * @returns The deleted session
   * @example
   * await this.sessionService.deleteByRefreshToken('123');
   */
  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    const session = await this.findByRefreshToken(refreshToken);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    await this.delete({
      id: session.id,
    });
  }

  /**
   * Counts the number of sessions
   * @param where - The where clause to count the sessions
   * @returns The number of sessions
   * @example
   * const count = await this.sessionService.count({
   *     isActive: true,
   * });
   */
  async count(where: Prisma.SessionWhereInput): Promise<number> {
    this.logger.log('Counting sessions', 'SessionService.count');
    const count = await this.sessionRepository.count(where);
    this.logger.log('Sessions counted', 'SessionService.count');
    return count;
  }

  /**
   * Aggregates the sessions
   * @param where - The where clause to aggregate the sessions
   * @param aggregate - The aggregate clause to aggregate the sessions
   * @returns The aggregated sessions
   * @example
   * const aggregate = await this.sessionService.aggregate({
   *     isActive: true,
   * }, {
   *     _count: true,
   * });
   */
  async aggregate(
    where: Prisma.SessionWhereInput,
    aggregate: Prisma.SessionAggregateArgs,
  ): Promise<ReturnType<typeof this.sessionRepository.aggregate>> {
    this.logger.log('Aggregating sessions', 'SessionService.aggregate');
    const aggregateResult = await this.sessionRepository.aggregate(
      where,
      aggregate,
    );
    this.logger.log('Sessions aggregated', 'SessionService.aggregate');
    return aggregateResult;
  }

  /**
   * Checks if a session exists
   * @param where - The where clause to check if the session exists
   * @returns True if the session exists, false otherwise
   * @example
   * const exists = await this.sessionService.exists({
   *     id: '123',
   * });
   */
  async exists(where: Prisma.SessionWhereInput): Promise<boolean> {
    this.logger.log('Checking if session exists', 'SessionService.exists');
    const exists = await this.sessionRepository.exists(where);
    this.logger.log('Session exists', 'SessionService.exists');
    return exists;
  }
}
