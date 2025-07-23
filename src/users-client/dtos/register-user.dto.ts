import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;

  @IsString({ message: 'Avatar must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The avatar of the user',
    example: 'https://example.com/avatar.png',
  })
  avatar?: string;

  @IsString({ message: 'Date of birth must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The date of birth of the user',
    example: '1990-01-01',
  })
  dateOfBirth?: string;

  @IsString({ message: 'Gender must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The gender of the user',
    example: 'male',
  })
  gender?: string;

  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St, Anytown, USA',
  })
  address?: string;

  @IsString({ message: 'City must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The city of the user',
    example: 'Anytown',
  })
  city?: string;

  @IsString({ message: 'State must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The state of the user',
    example: 'CA',
  })
  state?: string;

  @IsString({ message: 'Zip code must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The zip code of the user',
    example: '12345',
  })
  zipCode?: string;

  @IsString({ message: 'Country must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The country of the user',
    example: 'USA',
  })
  country?: string;

  @IsString({ message: 'Password reset token must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The password reset token of the user',
    example: '1234567890',
  })
  passwordResetToken?: string;

  @IsString({ message: 'Verification token must be a string' })
  @IsOptional()
  @ApiProperty({
    description: 'The verification token of the user',
    example: '1234567890',
  })
  verificationToken?: string;
}
