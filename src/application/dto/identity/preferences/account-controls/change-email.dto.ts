import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangeEmailDto {
  @IsEmail()
  @ApiProperty({ example: 'newemail@example.com' })
  newEmail: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Current password for verification' })
  password?: string;
}

export class ChangeEmailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  requiresVerification: boolean;

  @ApiProperty()
  verificationSentAt: Date;
}
