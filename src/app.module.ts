import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionModule } from './sessions/session.module';
import { LoggerModule } from './loggers/logger.module';

@Module({
  imports: [AuthModule, PrismaModule, SessionModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
