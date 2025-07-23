import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GoogleModule } from './google/google.module';
import { HealthModule } from './health/health.module';
import { SessionModule } from './sessions/session.module';
import { cacheModuleOptions } from './shared/configs/cache-options.config';
import cacheConfig from './shared/configs/cache.config';
import databaseConfig from './shared/configs/database.config';
import jwtConfig from './shared/configs/jwt.config';
import { throttlerModuleOptions } from './shared/configs/throttler-options.config';
import throttlerConfig from './shared/configs/throttler.config';
import { GlobalInterceptor } from './shared/interceptors/global.interceptor';
import { LoggerModule } from './shared/loggers/logger.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { envSchema } from './shared/schemas/env.schema';
import { SharedModule } from './shared/shared.module';
import { UserClientModule } from './users-client/user-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [cacheConfig, databaseConfig, jwtConfig, throttlerConfig],
      isGlobal: process.env.NODE_ENV !== 'test' ? true : false,
      validationSchema: envSchema,
    }),
    CacheModule.registerAsync(cacheModuleOptions),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync(throttlerModuleOptions),
    AuthModule,
    PrismaModule,
    SessionModule,
    LoggerModule,
    UserClientModule,
    SharedModule,
    GoogleModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
  ],
})
export class AppModule {}
