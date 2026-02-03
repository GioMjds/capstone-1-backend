import { IsOptional, IsInt, Min, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be greater than 0' })
  @ApiPropertyOptional({ description: 'Page number (1-based)', default: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be greater than 0' })
  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  limit?: number = 20;
}

export class PreferenceAuditLogsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['ui', 'notifications', 'security', 'compliance'], {
    message: 'category must be one of: ui, notifications, security, compliance',
  })
  @ApiPropertyOptional({ description: 'Filter by category' })
  category?: string;
}
