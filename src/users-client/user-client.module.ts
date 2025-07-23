import { LoggerModule } from '@/shared/loggers/logger.module';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserClientService } from './user-client.service';

@Module({
  imports: [PrismaModule, HttpModule, LoggerModule, ConfigModule],
  providers: [UserClientService],
  exports: [UserClientService],
})
export class UserClientModule {}
