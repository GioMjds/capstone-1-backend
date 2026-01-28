import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { UserResponseDto } from '../responses';

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

export class VerifyUserResponseDto {
  @ApiProperty({ 
    description: 'Verification success message',
    example: 'Email verified successfully.',
  })
  message: string;

  @ApiProperty({
    description: 'User response'
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}