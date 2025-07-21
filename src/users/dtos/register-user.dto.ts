import { Role } from "@/shared/enums/role.enum";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto  {
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;
    
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(32, { message: 'Password must be at most 32 characters long' })
    password: string;

    @IsString({ message: 'Avatar must be a string' })
    @IsOptional()
    avatar?: string;
    
    @IsString({ message: 'Date of birth must be a string' })
    @IsOptional()
    dateOfBirth?: string;

    @IsString({ message: 'Gender must be a string' })
    @IsOptional()
    gender?: string;

    @IsString({ message: 'Address must be a string' })
    @IsOptional()
    address?: string;

    @IsString({ message: 'City must be a string' })
    @IsOptional()
    city?: string;

    @IsString({ message: 'State must be a string' })
    @IsOptional()
    state?: string;

    @IsString({ message: 'Zip code must be a string' })
    @IsOptional()
    zipCode?: string;

    @IsString({ message: 'Country must be a string' })
    @IsOptional()
    country?: string;

    @IsString({ message: 'Password reset token must be a string' })
    @IsOptional()
    passwordResetToken?: string;

    @IsString({ message: 'Verification token must be a string' })
    @IsOptional()
    verificationToken?: string;
}
