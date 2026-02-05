import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class AnonymizeDataDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  confirmAnonymization: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['profile', 'activity', 'preferences'] })
  dataCategories?: string[];
}

export class AnonymizationResponseDto {
  @ApiProperty({ example: 'anonymize-123' })
  requestId: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiPropertyOptional({ example: ['profile', 'activity', 'preferences'] })
  dataCategories?: string[];

  @ApiProperty()
  requestedAt: Date;
}
