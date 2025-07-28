import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth.module';
import { GoogleModule } from './infra/google-auth/google.module';
import { HealthModule } from './modules/health/health.module';
import { SessionModule } from './modules/sessions/session.module';
import { cacheModuleOptions } from './shared/config/cache-options.config';
import { cacheConfig } from './shared/config/cache.config';
import { databaseConfig } from './shared/config/database.config';
import { jwtConfig } from './shared/config/jwt.config';
import { throttlerConfig } from './shared/config/throttler.config';
import { throttlerModuleOptions } from './shared/config/throttler-options.config';
import { GlobalInterceptor } from './shared/interceptors/global.interceptor';
import { LoggerModule } from './infra/logger/logger.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { envSchema } from './shared/schemas/env.schema';
import { SharedModule } from './shared/shared.module';
import { UserClientModule } from './libs/users-client/user-client.module';

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
