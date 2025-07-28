import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * The login user dto
 * @description This dto is used to login a user
 * @typedef {Object} LoginUserDto
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 * @property {string} rememberMe - The remember me of the user
 * @property {string} provider - The provider of the user
 * @example {
 *  email: 'john.doe@example.com',
 *  password: 'password',
 *  rememberMe: true,
 *  provider: 'google',
 * }
 */
export class LoginUserDto {
  /**
   * The email of the user
   */
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  /**
   * The password of the user
   */
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;

  /**
   * The remember me of the user
   */
  @IsBoolean({ message: 'Remember me must be a boolean' })
  @IsOptional()
  @ApiProperty({
    description: 'The remember me of the user',
    example: true,
  })
  rememberMe?: boolean;

  /**
   * The provider of the user
   */
  @IsString({ message: 'Provider must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The provider of the user',
    example: 'google',
  })
  provider?: string;
}
