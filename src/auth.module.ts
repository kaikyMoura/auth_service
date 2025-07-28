import { GoogleModule } from '@/infra/google-auth/google.module';
import { SessionModule } from '@/modules/sessions/session.module';
import { jwtModuleOptions } from '@/shared/config/jwt-options.config';
import { LoggerModule } from '@/infra/logger/logger.module';
import { UserClientModule } from '@/libs/users-client/user-client.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { GoogleLoginUseCase } from './application/use-cases/google-login.use-case';
import { GoogleRegisterUseCase } from './application/use-cases/google-register.use-case';
import { AuthController } from './controllers/auth.controller';
import { ClientInfoInterceptor } from './infra/interceptors/client-info.interceptor';
import { RateLimitService } from './application/services/rate-limit.service';
import { TokenService } from './application/services/token.service';
import { TokenGeneratorService } from './application/services/token-generator.service';
import { JwtStrategy } from './infra/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UserClientModule,
    SessionModule,
    LoggerModule,
    JwtModule.registerAsync(jwtModuleOptions),
    GoogleModule,
  ],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    GoogleLoginUseCase,
    GoogleRegisterUseCase,
    TokenService,
    TokenGeneratorService,
    RateLimitService,
    JwtStrategy,
    ClientInfoInterceptor,
  ],
  controllers: [AuthController],
  exports: [
    TokenService,
    TokenGeneratorService,
    RateLimitService,
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    GoogleLoginUseCase,
    GoogleRegisterUseCase,
    ClientInfoInterceptor,
  ],
})
export class AuthModule {}
