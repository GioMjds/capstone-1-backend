import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsString } from 'class-validator';

type Roles = 'ADMIN' | 'USER';

export class UserResponseDto {
  @ApiProperty({ example: 'usr_abc123def' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890', nullable: true })
  @IsString()
  phone: string | null;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  isEmailVerified: boolean;

  @IsEnum(['ADMIN', 'USER'])
  role: Roles;

  @ApiProperty({ example: null, nullable: true })
  @IsDate()
  archivedAt: Date | null;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDate()
  updatedAt: Date;
}