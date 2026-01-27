import { IsPasswordMatch, IsPasswordValid } from '@/shared/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Email address of the user changing the password',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Current password of the user',
    example: 'OldPassword123!',
    required: true,
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description:
      'New password for the user. Must be different from the current password and meet complexity requirements.',
    example: 'NewPassword123!',
    required: true,
  })
  @IsPasswordValid()
  newPassword: string;

  @ApiProperty({
    description: 'Confirmation of the new password. Must match the new password.',
    example: 'NewPassword123!',
    required: true,
  })
  @IsPasswordMatch('newPassword')
  confirmNewPassword: string;
}
