import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RequestDataDeletionDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  feedbackEmail?: string;
}

export class RequestDataDeletionResponseDto {
  @ApiProperty()
  requestId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  gracePeriodDays: number;

  @ApiProperty()
  willBeDeletedAt: Date;
}
