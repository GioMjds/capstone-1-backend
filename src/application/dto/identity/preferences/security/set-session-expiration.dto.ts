import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class SetSessionExpirationDto {
  @IsNumber()
  @Min(5)
  @ApiProperty({ minimum: 5, description: 'Minutes until session expires' })
  expirationMinutes: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional({ description: 'Warn user before expiration (minutes)' })
  warningMinutes?: number;
}

export class SetSessionExpirationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  expirationMinutes: number;

  @ApiProperty()
  warningMinutes: number;

  @ApiProperty()
  appliesImmediately: boolean;

  @ApiProperty()
  updatedAt: Date;
}
