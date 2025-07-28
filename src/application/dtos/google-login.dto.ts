import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * The Google login dto
 * @description This dto is used to login a user with Google OAuth
 * @typedef {Object} GoogleLoginDto
 * @property {string} token - The Google ID token
 * @example {
 *  token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
 * }
 */
export class GoogleLoginDto {
  /**
   * The Google ID token
   */
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token is required' })
  @ApiProperty({
    description: 'The Google ID token from the client',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}
