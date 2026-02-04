import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class GetPermissionChangeHistoryDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  limit?: number = 20;
}

export class PermissionChangeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  permissionName: string;

  @ApiProperty()
  granted: boolean;

  @ApiProperty()
  revokedBy?: string;

  @ApiProperty()
  reason?: string;

  @ApiProperty()
  affectedResources: string[];
}

export class GetPermissionChangeHistoryResponseDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty({ type: [PermissionChangeDto] })
  permissionChanges: PermissionChangeDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
