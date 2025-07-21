import { SessionService } from '@/sessions/session.service';
import { RegisterUserDto } from '@/users/dtos/register-user.dto';
import { RegisterUserResponse } from '@/users/types/register-user-response';
import { UsersService } from '@/users/users.service';
import { BadRequestException, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { TokenService } from './token.service';

/**
 * Auth service
 * @class AuthService
 * @description Auth service for authentication and authorization
 * @example
 * const authService = new AuthService(sessionService, logger);
 */
@Injectable()
export class AuthService {
    constructor(private readonly tokenService: TokenService, private readonly usersService: UsersService, private readonly logger: LoggerService, private readonly sessionService: SessionService) {}

    /**
     * Login a user
     * @param email - The email of the user
     * @param password - The password of the user
     * @returns The token
     * @throws {BadRequestException} - If the user is not found
     */
    async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        const validCredentials = await this.usersService.validateCredentials(email, password);
        if (!validCredentials) {
            throw new BadRequestException('Invalid credentials');
        }
        const accessToken = await this.tokenService.signAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role ?? undefined,
        });

        const refreshToken = await this.tokenService.signRefreshToken();

        await this.sessionService.create({
            userId: user.id,
            refreshToken: refreshToken.token,
            isActive: true,
            expiresAt: new Date(Date.now() + Number(refreshToken.expiresIn) * 1000),
        });

        return {
            accessToken: accessToken.token,
            refreshToken: refreshToken.token
        };
    }

    /**
     * Register a new user
     * @param registerUserDto - The user to register
     * @returns The registered user
     * @throws {BadRequestException} - If the user already exists
     */
    async register(registerUserDto: RegisterUserDto): Promise<RegisterUserResponse> {
        const user = await this.usersService.findUserByEmail(registerUserDto.email);
        if (user) {
            throw new BadRequestException('This email is already in use. Try to login instead.');
        }
        return await this.usersService.createUser(registerUserDto);
    }

    /**
     * Logout a user
     * @param refreshToken - The refresh token of the user
     * @returns The logged out user
     * @throws {NotFoundException} - If the session is not found
     * @throws {InternalServerErrorException} - If the session deletion fails
     */
    async logout(refreshToken: string): Promise<void> {
        await this.sessionService.deleteByRefreshToken(refreshToken);
    }
}
