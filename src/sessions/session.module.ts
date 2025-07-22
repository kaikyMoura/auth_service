import { PrismaModule } from '@/prisma/prisma.module';
import { LoggerModule } from '@/shared/loggers/logger.module';
import { LoggerService } from '@/shared/loggers/logger.service';
import { Module } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Module({
  imports: [LoggerModule, PrismaModule],
  providers: [SessionService, SessionRepository, LoggerService],
  exports: [SessionService],
})
export class SessionModule {}
