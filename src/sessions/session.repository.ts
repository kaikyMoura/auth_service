import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Session } from 'prisma/app/generated/prisma/client';

/**
 * Session repository
 * @class SessionRepository
 * @description Session repository for session management
 * @example
 * const sessionRepository = new SessionRepository(prisma);
 */
@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new session based on the provided data.
   *
   * @param session - The data to create the session with.
   * @returns The created session.
   */
  async create(session: Prisma.SessionCreateInput): Promise<Session> {
    return this.prisma.session.create({
      data: session,
    });
  }

  /**
   * Finds a unique session based on the provided criteria.
   *
   * @param where - The unique identifier for the session to find.
   * @returns The session that matches the criteria, or null if no match is found.
   */
  async findUnique(
    where: Prisma.SessionWhereUniqueInput,
  ): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where,
    });
  }

  /**
   * Finds the first session that matches the provided criteria and order by parameters.
   *
   * @param where - The filter criteria for sessions.
   * @param orderBy - The order by criteria for sessions.
   * @returns The first session that matches the criteria, or null if no match is found.
   */
  async findFirst(
    where?: Prisma.SessionWhereInput,
    orderBy?: Prisma.SessionOrderByWithRelationInput,
  ): Promise<Session | null> {
    return this.prisma.session.findFirst({
      where,
      orderBy,
    });
  }

  /**
   * Finds multiple sessions based on the provided criteria and pagination parameters.
   *
   * @param where - The filter criteria for sessions.
   * @param orderBy - The order by criteria for sessions.
   * @param take - The maximum number of sessions to return.
   * @param skip - The number of sessions to skip before returning results.
   * @returns An array of sessions that match the criteria.
   */
  async findMany(
    where?: Prisma.SessionWhereInput,
    orderBy?: Prisma.SessionOrderByWithRelationInput,
    take?: number,
    skip?: number,
  ): Promise<Session[]> {
    return this.prisma.session.findMany({
      where,
      orderBy,
      take,
      skip,
    });
  }

  /**
   * Updates a session based on the provided criteria and data.
   *
   * @param where - The unique identifier for the session to update.
   * @param data - The data to update the session with.
   * @returns The updated session.
   */
  async update(
    where: Prisma.SessionWhereUniqueInput,
    data: Prisma.SessionUpdateInput,
  ): Promise<Session> {
    return this.prisma.session.update({
      where,
      data,
    });
  }

  /**
   * Deletes a session based on the provided criteria.
   *
   * @param where - The unique identifier for the session to delete.
   * @returns The deleted session.
   */
  /**
   * Deletes a session based on the provided unique identifier.
   *
   * @param where - The unique identifier for the session to delete.
   * @returns The deleted session.
   */
  async delete(where: Prisma.SessionWhereUniqueInput): Promise<Session> {
    return this.prisma.session.delete({
      where,
    });
  }

  /**
   * Deletes multiple sessions based on the provided criteria.
   *
   * @param where - The filter criteria for sessions.
   * @returns The deleted sessions.
   */
  async deleteMany(where: Prisma.SessionWhereInput): Promise<void> {
    await this.prisma.session.deleteMany({
      where,
    });
  }

  /**
   * Counts the number of sessions that match the provided criteria.
   *
   * @param where - The filter criteria for sessions.
   * @returns The number of sessions that match the criteria.
   */
  async count(where: Prisma.SessionWhereInput): Promise<number> {
    return this.prisma.session.count({
      where,
    });
  }

  /**
   * Aggregates session data based on the provided criteria and aggregation arguments.
   * Returns the full aggregate result as provided by Prisma.
   *
   * @param where - The filter criteria for sessions.
   * @param aggregate - The aggregation arguments (e.g., _min, _max, _count, etc.).
   * @returns The aggregate result object.
   */
  async aggregate(
    where: Parameters<typeof this.prisma.session.aggregate>[0]['where'],
    aggregate: Omit<
      Parameters<typeof this.prisma.session.aggregate>[0],
      'where'
    >,
  ): Promise<ReturnType<typeof this.prisma.session.aggregate>> {
    return this.prisma.session.aggregate({
      where,
      ...aggregate,
    });
  }

  /**
   * Checks if a session exists based on the provided criteria.
   *
   * @param where - The filter criteria for sessions.
   * @returns True if a session exists, false otherwise.
   */
  async exists(where: Prisma.SessionWhereInput): Promise<boolean> {
    const count = await this.prisma.session.count({
      where,
    });
    return count > 0;
  }
}
