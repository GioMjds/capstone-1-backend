import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class SetSessionExpirationDto {
  @IsNumber()
  @Min(5)
  @Max(10080)
  @ApiProperty({ minimum: 5, maximum: 10080, description: 'Minutes until session expires', example: 60 })
  expirationMinutes: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(1440)
  @ApiPropertyOptional({ description: 'Warn user before expiration (minutes)', example: 5 })
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
