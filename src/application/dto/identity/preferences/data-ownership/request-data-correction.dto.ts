import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RequestDataCorrectionDto {
  @IsString()
  @ApiProperty({ example: 'email' })
  fieldName: string;

  @IsString()
  @ApiProperty({ example: 'old@example.com' })
  currentValue: string;

  @IsString()
  @ApiProperty({ example: 'new@example.com' })
  correctedValue: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Typo in email address' })
  reason?: string;
}

export class DataCorrectionResponseDto {
  @ApiProperty({ example: 'correction-123' })
  requestId: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: 'email' })
  fieldName: string;

  @ApiProperty()
  requestedAt: Date;
}
