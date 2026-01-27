import { IsPasswordValid } from '@/shared/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ 
    description: 'Email address associated with the user account',
    example: 'john@example.com',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'User account password',
    example: 'StrongPassword123!',
    required: true,
    minLength: 8
  })
  @IsPasswordValid()
  password: string;
}
