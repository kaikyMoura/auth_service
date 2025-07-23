import { CurrentRefreshToken } from '@/shared/decorators/current-refresh-token.decorator';
import { Public } from '@/shared/decorators/public.decorator';
import { LoginUserDto } from '@/users-client/dtos/login-user.dto';
import { RegisterUserDto } from '@/users-client/dtos/register-user.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from './guards/jwt.guard';
import { AuthService } from './services/auth.service';
import { AuthResponse } from './types/auth-response';

@Controller('auth')
@ApiTags('Auth')
@UseGuards(JwtGuard, ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  ): Promise<AuthResponse> {
    const response = await this.authService.register(registerUserDto);
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
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const response = await this.authService.login(loginUserDto);
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
    await this.authService.logout(refreshToken);

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
    const response = await this.authService.refreshToken(refreshToken);

    return {
      success: true,
      message: 'User token refreshed successfully',
      data: response,
    };
  }
}
