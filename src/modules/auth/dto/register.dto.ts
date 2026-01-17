import {
  IsPasswordMatch,
  IsPasswordValid,
} from '@/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123!' })
  @IsPasswordValid()
  password: string;

  @ApiProperty({ example: 'strongPassword123!' })
  @IsPasswordMatch('password')
  confirmPassword: string;
}
