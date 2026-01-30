import {
  IsPasswordMatch,
  IsPasswordValid,
} from '@/shared/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ 
    description: 'User first name',
    example: 'John',
    required: true,
    minLength: 3,
    maxLength: 50
  })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({ 
    description: 'User last name',
    example: 'Doe',
    required: true,
    minLength: 3,
    maxLength: 50
  })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({ 
    description: 'Unique email address for the user account',
    example: 'john@example.com',
    required: true
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString({ message: 'Number must be a string' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ 
    description: 'Strong password (min 8 characters, must contain uppercase, lowercase, number, and special character)',
    example: 'StrongPassword123!',
    required: true,
    minLength: 8
  })
  @IsPasswordValid()
  password: string;

  @ApiProperty({ 
    description: 'Password confirmation (must match password field)',
    example: 'StrongPassword123!',
    required: true,
    minLength: 8
  })
  @IsPasswordMatch('password')
  confirmPassword: string;
}