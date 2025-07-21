import { RegisterUserDto } from '@/users/dtos/register-user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { AuthResponse } from './types/auth-response';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'This email is already in use. Try to login instead' })
    @ApiBody({ type: RegisterUserDto, description: 'User registration body' })
    async register(@Body() registerUserDto: RegisterUserDto): Promise<AuthResponse> {
        const response = await this.authService.register(registerUserDto);
        return { success: true, message: 'User registered successfully', data: response };
    }
}
