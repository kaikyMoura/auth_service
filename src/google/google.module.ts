import { LoggerModule } from '@/shared/loggers/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthService } from './auth/google-auth.service';
import { GoogleService } from './google.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [GoogleService, GoogleAuthService],
  exports: [GoogleService, GoogleAuthService],
})
export class GoogleModule {}
