import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SessionCreateDto {
    @IsNotEmpty({ message: 'User ID is required' })
    @IsUUID()
    userId: string;

    @IsNotEmpty({ message: 'Refresh token is required' })
    @IsString({ message: 'Refresh token must be a string' })
    refreshToken: string;

    @IsOptional()
    @IsString({ message: 'IP address must be a string' })
    ipAddress?: string;

    @IsOptional()
    @IsString({ message: 'User agent must be a string' })
    userAgent?: string;

    @IsNotEmpty({ message: 'Is active is required' })
    @IsBoolean({ message: 'Is active must be a boolean' })
    isActive: boolean;

    @IsNotEmpty({ message: 'Expires at is required' })
    @IsDate({ message: 'Expires at must be a date' })
    expiresAt: Date;
}