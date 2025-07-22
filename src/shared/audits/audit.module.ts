import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { LoggerModule } from '../loggers/logger.module';
import { AuditService } from './audit.service';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
