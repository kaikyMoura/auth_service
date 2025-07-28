import { LoggerService } from '@/infra/logger/logger.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { MemoryMonitor } from '@/shared/utils/memory-monitor';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [HealthService, MemoryMonitor, PrismaService, LoggerService],
  controllers: [HealthController],
})
export class HealthModule {}
