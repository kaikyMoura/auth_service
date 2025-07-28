import { PrismaService } from '@/infra/prisma/prisma.service';
import { ISessionRepository } from '@/modules/sessions/domain/interfaces/session-repository.interface';
import { SessionMapper } from '@/modules/sessions/infra/mappers/session.mapper';
import { Injectable } from '@nestjs/common';
import { SessionEntity } from '../entities/session.entity';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new session
   * @param session - The session to create
   * @returns The created session
   */
  async create(session: SessionEntity): Promise<SessionEntity> {
    const data = await this.prisma.session.create({
      data: SessionMapper.toPrismaCreate(session),
    });

    return SessionMapper.toDomain(data);
  }

  /**
   * Find a session by token
   * @param token - The token of the session
   * @returns The session
   */
  async findByToken(token: string): Promise<SessionEntity | null> {
    const data = await this.prisma.session.findFirst({
      where: { refreshToken: token },
    });

    return data ? SessionMapper.toDomain(data) : null;
  }

  /**
   * Find a session by user id
   * @param userId - The user id of the session
   * @returns The session
   */
  async findByUserId(userId: string): Promise<SessionEntity | null> {
    const data = await this.prisma.session.findFirst({
      where: { userId },
    });

    return data ? SessionMapper.toDomain(data) : null;
  }

  /**
   * Find all sessions
   * @returns The sessions
   */
  async findAll(): Promise<SessionEntity[]> {
    const data = await this.prisma.session.findMany();
    return data.map((session) => SessionMapper.toDomain(session));
  }

  /**
   * Aggregate sessions by user id
   * @param userId - The user id of the session
   * @returns The sessions
   */
  async aggregate(userId: string): Promise<SessionEntity[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
    });
    return sessions.map((session) => SessionMapper.toDomain(session));
  }

  /**
   * Delete a session by token
   * @param token - The token of the session
   */
  async deleteByToken(token: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { refreshToken: token },
    });
  }

  /**
   * Delete a session by user id
   * @param userId - The user id of the session
   */
  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  /**
   * Delete expired sessions
   */
  async deleteExpiredSessions(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
  }

  /**
   * Update a session
   * @param id - The id of the session
   * @param data - The data to update the session
   * @returns The updated session
   */
  async update(id: string, data: SessionEntity): Promise<SessionEntity> {
    const session = await this.prisma.session.update({
      where: { id },
      data: SessionMapper.toPrismaUpdate(data),
    });
    return SessionMapper.toDomain(session);
  }
  /**
   * Check if a session exists by token
   * @param token - The token of the session
   * @returns True if the session exists, false otherwise
   */
  async exists(token: string): Promise<boolean> {
    const data = await this.prisma.session.findFirst({
      where: { refreshToken: token },
    });

    return !!data;
  }

  /**
   * Count sessions
   * @param where - The where clause to count the sessions
   * @returns The number of sessions
   */
  async count(userId: string): Promise<number> {
    const data = await this.prisma.session.count({ where: { userId } });
    return data;
  }
}
