import { PrismaModule } from '@/prisma/prisma.module';
import { LoggerModule } from '@/shared/loggers/logger.module';
import { LoggerService } from '@/shared/loggers/logger.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserClientService } from './user-client.service';

@Module({
  imports: [PrismaModule, HttpModule, LoggerModule, ConfigModule],
  providers: [UserClientService, LoggerService],
  exports: [UserClientService],
})
export class UserClientModule {}
