import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({ 
    description: 'Email address of the user to verify',
    example: 'john@example.com',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: '6-digit OTP code received via email after registration',
    example: '123456',
    required: true
  })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;
}
