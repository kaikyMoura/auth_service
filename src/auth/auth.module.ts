import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@/users-client/user-client.module';
import { SessionModule } from '@/sessions/session.module';
import { TokenService } from './services/token.service';
import { LoggerModule } from '@/shared/loggers/logger.module';
import { LoggerService } from '@/shared/loggers/logger.service';

@Module({
  imports: [ConfigModule, UsersModule, SessionModule, LoggerModule],
  providers: [AuthService, TokenService, LoggerService],
  controllers: [AuthController],
})
export class AuthModule {}
