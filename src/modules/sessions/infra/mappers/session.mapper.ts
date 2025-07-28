import { SessionEntity } from '@/modules/sessions/domain/entities/session.entity';
import {
  Prisma,
  Session as PrismaSession,
} from 'prisma/app/generated/prisma/client';

/**
 * Session mapper
 * @description This mapper is used to convert between domain and prisma entities
 */
export class SessionMapper {
  /**
   * Convert a prisma session to a domain session
   * @param prisma - The prisma session
   * @returns The domain session
   */
  static toDomain(prisma: PrismaSession): SessionEntity {
    return new SessionEntity(
      prisma.userId,
      prisma.refreshToken,
      prisma.userAgent ?? '',
      prisma.ipAddress ?? '',
      prisma.isActive ?? true,
      prisma.expiresAt,
      prisma.id,
    );
  }

  /**
   * Convert a domain session to a prisma session
   * @param domain - The domain session
   * @returns The prisma session
   */
  static toPrisma(domain: SessionEntity): PrismaSession {
    return {
      id: domain.id,
      userId: domain.userId,
      refreshToken: domain.refreshToken,
      userAgent: domain.userAgent,
      ipAddress: domain.ipAddress,
      isActive: domain.isActive,
      createdAt: domain.createdAt,
      expiresAt: domain.expiresAt,
      updatedAt: domain.updatedAt ?? undefined,
      lastUsedAt: domain.lastUsedAt ?? undefined,
    } as PrismaSession;
  }

  /**
   * Convert a domain session to a prisma create input
   * @param domain - The domain session
   * @returns The prisma create input
   */
  static toPrismaCreate(domain: SessionEntity): Prisma.SessionCreateInput {
    const {
      id,
      userId,
      refreshToken,
      userAgent,
      ipAddress,
      isActive,
      createdAt,
      expiresAt,
    } = domain;
    return {
      id,
      userId,
      refreshToken,
      userAgent,
      ipAddress,
      isActive,
      createdAt,
      expiresAt,
    };
  }

  /**
   * Convert a domain session to a prisma update input
   * @param domain - The domain session
   * @returns The prisma update input
   */
  static toPrismaUpdate(domain: SessionEntity): Prisma.SessionUpdateInput {
    const { userId, refreshToken, userAgent, ipAddress, isActive, expiresAt } =
      domain;

    const data: Prisma.SessionUpdateInput = {};

    if (userId !== undefined) data.userId = userId;
    if (refreshToken !== undefined) data.refreshToken = refreshToken;
    if (userAgent !== undefined) data.userAgent = userAgent;
    if (ipAddress !== undefined) data.ipAddress = ipAddress;
    if (isActive !== undefined) data.isActive = isActive;
    if (expiresAt !== undefined) data.expiresAt = expiresAt;

    return data;
  }
}
