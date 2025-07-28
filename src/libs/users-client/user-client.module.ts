import { LoggerModule } from '@/infra/logger/logger.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { USER_CLIENT_SERVICE } from './domain/interfaces/user-client.tokens';
import { UserClientService } from './infra/services/user-client.service';

/**
 * User client module
 * @description This module is used to provide the user client service
 */
@Module({
  imports: [HttpModule, LoggerModule, ConfigModule],
  providers: [
    {
      provide: USER_CLIENT_SERVICE,
      useClass: UserClientService,
    },
  ],
  exports: [USER_CLIENT_SERVICE],
})
export class UserClientModule {}
