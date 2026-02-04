import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class SetPasswordRotationReminderDto {
  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(365)
  @ApiPropertyOptional({ minimum: 30, maximum: 365 })
  reminderDaysBeforeExpiry?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(365)
  @ApiPropertyOptional({ minimum: 0, maximum: 365 })
  passwordExpirationDays?: number;
}

export class SetPasswordRotationReminderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reminderDaysBeforeExpiry: number;

  @ApiProperty()
  passwordExpirationDays: number;

  @ApiProperty()
  lastChangedAt: Date;

  @ApiProperty()
  nextExpirationAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
