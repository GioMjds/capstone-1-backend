import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class RequestDataDeletionDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['profile', 'activity', 'preferences'] })
  dataCategories?: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'No longer using the service' })
  reason?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'feedback@example.com' })
  feedbackEmail?: string;
}

export class DataDeletionResponseDto {
  @ApiProperty({ example: 'deletion-123' })
  requestId: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiPropertyOptional({ example: ['profile', 'activity', 'preferences'] })
  dataCategories?: string[];

  @ApiProperty()
  requestedAt: Date;

  @ApiProperty()
  scheduledDeletionAt: Date;
}
