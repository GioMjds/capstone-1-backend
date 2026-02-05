import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SetSortFilterDefaultsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'createdAt' })
  defaultSortField?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiPropertyOptional({ enum: SortOrder, example: SortOrder.DESC })
  defaultSortOrder?: SortOrder;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({ example: { status: 'active', category: 'all' } })
  defaultFilters?: Record<string, unknown>;
}

export class SortFilterDefaultsResponseDto {
  @ApiProperty({ example: 'createdAt' })
  defaultSortField: string;

  @ApiProperty({ enum: SortOrder, example: SortOrder.DESC })
  defaultSortOrder: SortOrder;

  @ApiPropertyOptional({ example: { status: 'active', category: 'all' } })
  defaultFilters?: Record<string, unknown>;

  @ApiProperty()
  updatedAt: Date;
}
