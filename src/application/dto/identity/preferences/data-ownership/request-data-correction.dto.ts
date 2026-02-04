import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestDataCorrectionDto {
  @IsString()
  @ApiProperty()
  field: string;

  @IsString()
  @ApiProperty()
  currentValue: string;

  @IsString()
  @ApiProperty()
  correctedValue: string;

  @IsString()
  @ApiPropertyOptional()
  reason?: string;
}

export class RequestDataCorrectionResponseDto {
  @ApiProperty()
  requestId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  reviewedAt?: Date;

  @ApiProperty()
  appliedAt?: Date;
}
