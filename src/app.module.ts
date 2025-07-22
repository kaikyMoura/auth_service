import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionModule } from './sessions/session.module';
import { cacheModuleOptions } from './shared/configs/cache-options.config';
import cacheConfig from './shared/configs/cache.config';
import databaseConfig from './shared/configs/database.config';
import { jwtModuleOptions } from './shared/configs/jwt-options.config';
import jwtConfig from './shared/configs/jwt.config';
import throttlerConfig from './shared/configs/throttler.config';
import { throttlerModuleOptions } from './shared/configs/throttler-options.config';
import { LoggerModule } from './shared/loggers/logger.module';
import { envSchema } from './shared/schemas/env.schema';
import { UserClientModule } from './users-client/user-client.module';

@Module({
  imports: [
    CacheModule.registerAsync(cacheModuleOptions),
    ConfigModule.forRoot({
      load: [cacheConfig, databaseConfig, jwtConfig, throttlerConfig],
      isGlobal: process.env.NODE_ENV !== 'test' ? true : false,
      validationSchema: envSchema,
    }),
    ThrottlerModule.forRootAsync(throttlerModuleOptions),
    JwtModule.registerAsync(jwtModuleOptions),
    AuthModule,
    PrismaModule,
    SessionModule,
    LoggerModule,
    UserClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
