import { LoggerModule } from '@/infra/logger/logger.module';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Module } from '@nestjs/common';
import {
  SESSION_REPOSITORY,
  SESSION_SERVICE,
} from './domain/interfaces/session.tokens';
import { SessionRepository } from './domain/repositories/session.repository';
import { SessionService } from './infra/services/session.service';

@Module({
  imports: [LoggerModule, PrismaModule],
  providers: [
    PrismaService,
    {
      provide: SESSION_REPOSITORY,
      useClass: SessionRepository,
    },
    {
      provide: SESSION_SERVICE,
      useClass: SessionService,
    },
    SessionService,
  ],
  exports: [SESSION_SERVICE, SessionService],
})
export class SessionModule {}
