import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDateString,
  Matches,
} from 'class-validator';

/**
 * The register user dto
 * @description This dto is used to register a user
 * @typedef {Object} RegisterUserDto
 * @property {string} firstName - The first name of the user
 * @property {string} lastName - The last name of the user
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 * @property {string} avatar - The avatar of the user
 * @property {string} dateOfBirth - The date of birth of the user
 * @property {string} provider - The provider of the user
 * @example {
 *  firstName: 'John',
 *  lastName: 'Doe',
 *  email: 'john.doe@example.com',
 *  password: 'SecurePass123!',
 *  avatar: 'https://example.com/avatar.png',
 *  dateOfBirth: '1990-01-01',
 *  provider: 'google',
 * }
 */
export class RegisterUserDto {
  /**
   * The first name of the user
   */
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must be at most 50 characters long' })
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, {
    message: 'First name can only contain letters and spaces',
  })
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    minLength: 2,
    maxLength: 50,
  })
  firstName: string;

  /**
   * The last name of the user
   */
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must be at most 50 characters long' })
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, {
    message: 'Last name can only contain letters and spaces',
  })
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    minLength: 2,
    maxLength: 50,
  })
  lastName: string;

  /**
   * The email of the user
   */
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must be at most 255 characters long' })
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    maxLength: 255,
  })
  email: string;

  /**
   * The password of the user
   */
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must be at most 128 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @ApiProperty({
    description:
      'The password of the user (must contain uppercase, lowercase, number, and special character)',
    example: 'SecurePass123!',
    minLength: 8,
    maxLength: 128,
  })
  password: string;

  /**
   * The avatar URL of the user
   */
  @IsString({ message: 'Avatar must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Avatar URL must be at most 500 characters long' })
  @Matches(/^https?:\/\/.+/, { message: 'Avatar must be a valid URL' })
  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.png',
    required: false,
    maxLength: 500,
  })
  avatar?: string;

  /**
   * The date of birth of the user
   */
  @IsDateString({}, { message: 'Date of birth must be a valid date string' })
  @IsOptional()
  @ApiProperty({
    description: 'The date of birth of the user (YYYY-MM-DD format)',
    example: '1990-01-01',
    required: false,
  })
  dateOfBirth?: string;

  /**
   * The provider of the user
   */
  @IsString({ message: 'Provider must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The provider of the user',
    example: 'google',
    required: false,
  })
  provider?: string;
}
