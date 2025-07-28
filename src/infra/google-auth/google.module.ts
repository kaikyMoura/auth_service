import { LoggerModule } from '@/infra/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthService } from './google-auth.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [GoogleAuthService],
  exports: [GoogleAuthService],
})
export class GoogleModule {}
