import {
  IsPasswordMatch,
  IsPasswordValid,
} from '@/decorators/password.decorator';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPasswordValid()
  password: string;

  @IsPasswordMatch('password')
  confirmPassword: string;
}
