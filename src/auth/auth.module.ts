import { SessionModule } from '@/sessions/session.module';
import { jwtModuleOptions } from '@/shared/configs/jwt-options.config';
import { LoggerModule } from '@/shared/loggers/logger.module';
import { UserClientModule } from '@/users-client/user-client.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UserClientModule,
    SessionModule,
    LoggerModule,
    JwtModule.registerAsync(jwtModuleOptions),
  ],
  providers: [AuthService, TokenService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
