import { CurrentRefreshToken } from '@/infra/decorators/current-refresh-token.decorator';
import { Public } from '@/infra/decorators/public.decorator';
import { ClientInfo } from '@/infra/decorators/client-info.decorator';
import { LoginUserDto } from '@/application/dtos/login-user.dto';
import { RegisterUserDto } from '@/application/dtos/register-user.dto';
import { GoogleLoginDto } from '@/application/dtos/google-login.dto';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from '../infra/guards/jwt.guard';
import { AuthResponse } from '../application/dtos/auth-response.dto';
import { RolesGuard } from '../infra/guards/roles.guard';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../application/use-cases/logout.use-case';
import { ClientInfoInterceptor } from '../infra/interceptors/client-info.interceptor';
import { GoogleLoginUseCase } from '@/application/use-cases/google-login.use-case';
import { GoogleRegisterUseCase } from '@/application/use-cases/google-register.use-case';
import { IClientInfo } from '@/domain/interfaces/client-info.interface';

/**
 * The auth controller
 * @description This controller is responsible for the auth routes
 */
@Controller('auth')
@ApiTags('Auth')
@UseGuards(JwtGuard, ThrottlerGuard, RolesGuard)
@UseInterceptors(ClientInfoInterceptor)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly googleRegisterUseCase: GoogleRegisterUseCase,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 400,
    description: 'This email is already in use. Try to login instead',
  })
  @ApiBody({ type: RegisterUserDto, description: 'User registration body' })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @ClientInfo() clientInfo: IClientInfo,
  ): Promise<AuthResponse> {
    const response = await this.registerUseCase.execute(
      registerUserDto,
      clientInfo.ipAddress,
      clientInfo.userAgent,
    );
    return {
      success: true,
      message: 'User registered successfully',
      data: response,
    };
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiBody({ type: LoginUserDto, description: 'User login body' })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @ClientInfo() clientInfo: IClientInfo,
  ): Promise<AuthResponse> {
    const response = await this.loginUseCase.execute(
      loginUserDto,
      clientInfo.ipAddress,
      clientInfo.userAgent,
    );
    return {
      success: true,
      message: 'User logged in successfully',
      data: response,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 400, description: 'Invalid refresh token' })
  async logout(
    @CurrentRefreshToken() refreshToken: string,
  ): Promise<AuthResponse> {
    await this.logoutUseCase.execute(refreshToken);

    return {
      success: true,
      message: 'User logged out successfully',
    };
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh a user token' })
  @ApiResponse({
    status: 200,
    description: 'User token refreshed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid refresh token' })
  async refreshToken(
    @CurrentRefreshToken() refreshToken: string,
  ): Promise<AuthResponse> {
    const response = await this.refreshTokenUseCase.execute(refreshToken);

    return {
      success: true,
      message: 'User token refreshed successfully',
      data: response,
    };
  }

  @Public()
  @Post('google/login')
  @ApiOperation({ summary: 'Login with Google OAuth' })
  @ApiResponse({ status: 200, description: 'User logged in with Google' })
  @ApiResponse({ status: 400, description: 'Invalid Google token' })
  @ApiResponse({ status: 401, description: 'No account found with this email' })
  @ApiBody({ type: GoogleLoginDto, description: 'Google login body' })
  async googleLogin(
    @Body() googleLoginDto: GoogleLoginDto,
    @ClientInfo() clientInfo: IClientInfo,
  ): Promise<AuthResponse> {
    const response = await this.googleLoginUseCase.execute(
      googleLoginDto.token,
      clientInfo,
    );

    return {
      success: true,
      message: 'User logged in with Google',
      data: response,
    };
  }

  @Public()
  @Post('google/signup')
  @ApiOperation({ summary: 'Signup with Google OAuth' })
  @ApiResponse({ status: 200, description: 'User signed up with Google' })
  @ApiResponse({ status: 400, description: 'Invalid Google token' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @ApiBody({ type: GoogleLoginDto, description: 'Google signup body' })
  async googleSignup(
    @Body() googleLoginDto: GoogleLoginDto,
    @ClientInfo() clientInfo: IClientInfo,
  ): Promise<AuthResponse> {
    const response = await this.googleRegisterUseCase.execute(
      googleLoginDto.token,
      clientInfo,
    );

    return {
      success: true,
      message: 'User signed up with Google',
      data: response,
    };
  }

  @Public()
  @Post('google/callback')
  @ApiOperation({ summary: 'Callback for Google OAuth' })
  @ApiResponse({ status: 200, description: 'Google OAuth callback' })
  @ApiResponse({ status: 400, description: 'Invalid Google token' })
  @ApiBody({ type: GoogleLoginDto, description: 'Google callback body' })
  async googleCallback(
    @Body() googleLoginDto: GoogleLoginDto,
    @ClientInfo() clientInfo: IClientInfo,
  ): Promise<AuthResponse> {
    // Try to login first, if user doesn't exist, register them
    try {
      const loginResponse = await this.googleLoginUseCase.execute(
        googleLoginDto.token,
        clientInfo,
      );

      return {
        success: true,
        message: 'User logged in with Google',
        data: loginResponse,
      };
    } catch (error) {
      if ((error as Error).message.includes('No account found')) {
        // User doesn't exist, register them
        const registerResponse = await this.googleRegisterUseCase.execute(
          googleLoginDto.token,
          clientInfo,
        );

        return {
          success: true,
          message: 'User registered and logged in with Google',
          data: registerResponse,
        };
      }
      throw error;
    }
  }
}
