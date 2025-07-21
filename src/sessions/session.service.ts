import { Injectable, LoggerService } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { SessionCreateDto } from './dtos/session-create.dto';
import { Prisma, Session } from 'prisma/app/generated/prisma/client';

@Injectable()
export class SessionService {
    constructor(private readonly sessionRepository: SessionRepository, private readonly logger: LoggerService) {}

    /**
     * Creates a new session
     * @param session - The session to create
     * @returns The created session
     */
    async create(session: SessionCreateDto): Promise<Session> {
        try {
            this.logger.log('Creating session', 'SessionService.create');
            const newSession = await this.sessionRepository.create({
                ...session,
            });
            this.logger.log('Session created', 'SessionService.create');
            return newSession;
        } catch (error) {
            this.logger.error(error.message, error.stack, 'SessionService.create');
            throw error;
        }
    }

    /**
     * Finds a unique session
     * @param where - The where clause to find the session
     * @returns The found session
     */
    async findUnique(where: Prisma.SessionWhereUniqueInput): Promise<Session | null> {
        try {
            this.logger.log('Finding unique session', 'SessionService.findUnique');
            const session = await this.sessionRepository.findUnique(where);
            this.logger.log('Session found', 'SessionService.findUnique');
            return session;
        } catch (error) {
            this.logger.error(error.message, error.stack, 'SessionService.findUnique');
            throw error;
        }
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
    async findFirst(where: Prisma.SessionWhereInput, orderBy: Prisma.SessionOrderByWithRelationInput): Promise<Session | null> {
        try {
            this.logger.log('Finding first session', 'SessionService.findFirst');
            const session = await this.sessionRepository.findFirst(where, orderBy);
            this.logger.log('Session found', 'SessionService.findFirst');
            return session;
        } catch (error) {
            this.logger.error(error.message, error.stack, 'SessionService.findFirst');
            throw error;
        }
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
    async findMany(where: Prisma.SessionWhereInput, orderBy: Prisma.SessionOrderByWithRelationInput, take: number, skip: number): Promise<Session[]> {
        try {
            this.logger.log('Finding many sessions', 'SessionService.findMany');
            const sessions = await this.sessionRepository.findMany(where, orderBy, take, skip);
            this.logger.log('Sessions found', 'SessionService.findMany');
            return sessions;
        } catch (error) {
            this.logger.error(error.message, error.stack, 'SessionService.findMany');
            throw error;
        }
    }

    /**
     * Updates a session
     * @param where - The where clause to update the session
     * @param data - The data to update the session
     * @returns The updated session
     */
    async update(where: Prisma.SessionWhereUniqueInput, data: Prisma.SessionUpdateInput): Promise<void> {
        try {
            this.logger.log('Updating session', 'SessionService.update');
            await this.sessionRepository.update(where, data);
            this.logger.log('Session updated', 'SessionService.update');
        } catch (error) {
            this.logger.error(error.message, error.stack, 'SessionService.update');
            throw error;
        }
    }

    /**
     * Deletes a session
     * @param where - The where clause to delete the session
     * @returns The deleted session
     */
    async delete(where: Prisma.SessionWhereUniqueInput): Promise<void> {
        try {
            this.logger.log('Deleting session', 'SessionService.delete');
            await this.sessionRepository.delete(where);
            this.logger.log('Session deleted', 'SessionService.delete');
        } catch (error) {
            this.logger.error(error.message, error.stack, 'SessionService.delete');
            throw error;
        }
    }

    /**
     * Counts the number of sessions
     * @param where - The where clause to count the sessions
     * @returns The number of sessions
     */
    async count(where: Prisma.SessionWhereInput): Promise<number> {
        try {
            this.logger.log('Counting sessions', 'SessionService.count');
            const count = await this.sessionRepository.count(where);
            this.logger.log('Sessions counted', 'SessionService.count');
            return count;
        } catch (error) {
            this.logger.error(error.message, error.stack, 'SessionService.count');
            throw error;
        }
    }

    /**
     * Aggregates the sessions
     * @param where - The where clause to aggregate the sessions
     * @param aggregate - The aggregate clause to aggregate the sessions
     * @returns The aggregated sessions
     */
    async aggregate(where: Prisma.SessionWhereInput, aggregate: Prisma.SessionAggregateArgs): Promise<ReturnType<typeof this.sessionRepository.aggregate>> {
        try {
            this.logger.log('Aggregating sessions', 'SessionService.aggregate');
            const aggregateResult = await this.sessionRepository.aggregate(where, aggregate);
            this.logger.log('Sessions aggregated', 'SessionService.aggregate');
            return aggregateResult;
        } catch (error) {
            this.logger.error(error.message, error.stack, 'SessionService.aggregate');
            throw error;
        }
    }

    /**
     * Checks if a session exists
     * @param where - The where clause to check if the session exists
     * @returns True if the session exists, false otherwise
     */
    async exists(where: Prisma.SessionWhereInput): Promise<boolean> {
        try {
            this.logger.log('Checking if session exists', 'SessionService.exists');
            const exists = await this.sessionRepository.exists(where);
            this.logger.log('Session exists', 'SessionService.exists');
            return exists;
        } catch (error) {
            this.logger.error(error.message, error.stack, 'SessionService.exists');
            throw error;
        }
    }
}
