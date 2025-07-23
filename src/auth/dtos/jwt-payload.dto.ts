import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Role } from 'src/shared/enums/role.enum';

/**
 * Jwt payload
 * @class JwtPayload
 * @description Jwt payload for jwt management
 * @example
 * const jwtPayload = new JwtPayload(sub, email, role, iat, exp);
 */
export class JwtPayload {
  /**
   * The subject of the token (user id)
   */
  @IsUUID(undefined, { message: 'Invalid user id' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'The subject of the token (user id)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sub: string;
  /**
   * The email of the user
   */
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;
  /**
   * The role of the user
   */
  @IsEnum(Role, { message: 'Invalid role' })
  @IsOptional()
  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  role?: Role;
  /**
   * The issued at time of the token
   */
  @IsNumber({}, { message: 'Invalid issued at time' })
  @IsOptional()
  @ApiProperty({
    description: 'The issued at time of the token',
    example: 1716537600,
  })
  iat?: number;
  /**
   * The expiration time of the token
   */
  @IsNumber({}, { message: 'Invalid expiration time' })
  @IsOptional()
  @ApiProperty({
    description: 'The expiration time of the token',
    example: 1716537600,
  })
  exp?: number;
  /**
   * The session id of the user
   */
  @IsString({ message: 'Invalid session id' })
  @IsOptional()
  @ApiProperty({
    description: 'The session id of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sid?: string;
}
