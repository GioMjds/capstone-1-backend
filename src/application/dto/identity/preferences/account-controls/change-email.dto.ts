import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailDto {
  @IsEmail()
  @ApiProperty({ example: 'newemail@example.com' })
  newEmail: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class ChangeEmailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  verified: boolean;

  @ApiProperty()
  verificationSentAt: Date;
}
